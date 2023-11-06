import { ref as storageRef, uploadBytes } from "firebase/storage";
import {
    doc,
    addDoc,
    updateDoc,
    onSnapshot,
    arrayUnion,
    collection, setDoc
} from "firebase/firestore";
import {ref, set, onValue, update} from "firebase/database";
import {useLayoutEffect, useRef, useState} from "react";
import {realtime, firestore, storage, MDB, adminEmail} from "./config";
import {getFileType} from "helpers/files";
import {useSelector} from "react-redux";
import store from "store";
import {getGlobalTime} from "../../../api/requests";
import {actions} from "../store/reducers";
import {triggerEvent} from "../../../helpers/events";

const uniqueID = () => Math.floor(performance.now() + performance.timeOrigin * 100);

export class MessageManager {
    db = null;
    storage = null;
    actions = null;
    appName = null;
    config = {};

    constructor(appName, actions, config) {
        this.db = collection(firestore, 'apps', appName, 'data');
        this.storage = appName;
        this.actions = actions;
        this.appName = appName;
        this.config = config;
    }

    async sendMessage(data) {
        let sendData = {
            id: uniqueID(),
            timeSent: (await getGlobalTime()).utc_datetime,
            user: data.user_id,
            value: data.message,
            ...data.extraFields,
        };
        await updateDoc(doc(this.db, this.config.getDocument()), {messages: arrayUnion(sendData)});
        return sendData;
    }

    uploadMedia(upload) {
        const time = new Date().getTime();
        const uploadRef = storageRef(storage, 'uploads/messages/' + time + '_' + upload.name);
        return uploadBytes(uploadRef, upload).then((snapshot) => snapshot.metadata.fullPath);
    }
}

export function updateUser(type, data) {
    const {user} = store.getState().messenger;
    if (type === 'firestore') {
        const newUser = {[user.id]: {...user, ...data}};
        delete newUser[user.id].isTyping;
        delete newUser[user.id].online;
        delete newUser[user.id].lastSeen;
        delete newUser[user.id].currentRoom;
        customUpdate('users', '', newUser);
    } else {
        update(ref(realtime, 'users/' + user.id), data);
    }
}

export function changeRoomData(room, user, users) {
    if (!room.picture || !room.title) {
        let email = Object.values(room.users).filter(e => e !== user.email)[0];
        let companion = Object.values(users).find(e => e.email === email);
        if (!email) companion = user;
        if (!companion) return room;
        return {...room, picture: companion.picture, title: companion.name, companion: companion.id};
    } else {
        return room;
    }
}

export function createUser(user) {
    return setDoc(doc(MDB, 'users'), {
        id: new Date().getTime(),
        picture: '',
        rooms: [],
        ...user,
    });
}


export function createRoom(usersInRoom) {
    const room = {
        users: usersInRoom.map(u => u.email),
        picture: '',
        title: '',
        lastMessage: {},
        newMessage: false,
        notified: false,
        id: uniqueID(),
    };
    const messagesDoc = {
        messages: [],
    }
    console.log(room)
    addDoc(MDB, messagesDoc).then(m => {
        room.messages = m.id;
        updateDoc(doc(MDB, 'rooms'), {rooms: arrayUnion(room)});

        if (usersInRoom[0].id === usersInRoom[1].id) usersInRoom = [usersInRoom[0]];
        let updatedUsers = {};

        usersInRoom.forEach(user => {
            updatedUsers[user.id] = {...user, rooms: [...user.rooms, room.id]};
        });

        customUpdate('users', '', updatedUsers).then(()=> setCurrentRoom(room.id));
    });
    // console.log('created room', room);
}

export function customUpdate(name, raw, newData) {
    const state = store.getState().messenger;
    if (raw) raw = '_' + raw;
    const data_raw = state[name + raw];
    return updateDoc(doc(MDB, name), {[name]: Object.values({...data_raw, ...newData})});
}

export function useGetUsers() {
    useLayoutEffect(() => {
        const unsubscribe = onSnapshot(doc(MDB, 'users'), q => {
            let newUsers = {};
            q.data().users.forEach(user => {
                newUsers[user.id] = user;
            });
            store.dispatch(actions.setField({field:'users', data: newUsers}));
            // console.log('snapshot users', newUsers);
        });
        return () => unsubscribe;
    }, []);
    useLayoutEffect(() => {
        const usersMeta = ref(realtime, 'users');
        onValue(usersMeta, (snapshot) => {
            const data = snapshot.val();
            store.dispatch(actions.setUsersMeta({data}));
        });
    }, []);
}

function createNotification(info) {
    new Notification(info.title, {body: info.body});
}


function notifyUser(info) {
    // console.log(info)
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
        createNotification(info);
    } else if (Notification.permission !== "denied") {
        triggerEvent('user-prompt', {text:'Разрешите уведомления, чтобы всегда быть в курсе новостей.'})
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                createNotification(info);
            }
        });
    }
}

export function useGetRooms() {
    const {rooms_raw, user, users, room} = useSelector(state => state.messenger);
    useLayoutEffect(() => {
        const unsubscribe = onSnapshot(doc(MDB, 'rooms'), q => {
            let newRooms = {};
            q.data().rooms.forEach(r => newRooms[r.id] = r);
            store.dispatch(actions.setField({field:'rooms_raw', data:newRooms}));
            // console.log('snapshot rooms')
        });
        return () => unsubscribe;
    }, []);

    useLayoutEffect(() => {
        if (!user) return;
        let newRooms = [];
        let roomWithAdmin = false;
        Object.values(rooms_raw).map(r => {
            if (r.users.includes(user.email)) {
                newRooms.push(r);
                if (r.users.includes(adminEmail)) roomWithAdmin = true;
            }
        });
        console.log(users)
        if (!roomWithAdmin) {
            let u = [user, Object.values(users).filter(u => u.email === adminEmail)[0]];
            console.log(u)
            if (u.length > 1) {
                createRoom(u);
            }
        }
        let objRooms = {};
        newRooms.forEach(r => {
            objRooms[r.id] =  changeRoomData(r, user, users);
        });
        store.dispatch(actions.setField({field:'rooms', data:objRooms}));
        let haveNewMessage = false;
        for (const r in objRooms) {
            const curRoom = objRooms[r];
            // console.log(curRoom)
            if (curRoom.newMessage && curRoom.lastMessage.user !== user.id && !haveNewMessage) {
                triggerEvent("messenger:notification", true);
                haveNewMessage = true;
            }
            if (!(curRoom.newMessage && curRoom.lastMessage.user !== user.id) || curRoom.notified) continue;
            updateRoom({...curRoom, notified: true});
            notifyUser({title: 'Новое сообщение',
                body: users[curRoom.lastMessage.user].name + ': ' + curRoom.lastMessage.value.text});
        }
        !haveNewMessage && triggerEvent("messenger:notification", false);
        room.id && objRooms[room.id] && objRooms[room.id].newMessage &&
        objRooms[room.id].lastMessage.user !== user.id && updateRoom({newMessage: false});
        console.log('obj rooms', objRooms)
    }, [user, rooms_raw, Object.values(users).length]);
}

export function updateRoom(data) {
    const {room} = store.getState().messenger;
    let newRoom = {[room.id]: {...room, ...data, title:'',picture:''}};
    delete newRoom[room.id].companion;
    // console.log('rooms update', data)
    return customUpdate('rooms', 'raw', newRoom);
}

export function setCurrentRoom(id) {
    if (!id) store.dispatch(actions.setRoom(-1));
    else store.dispatch(actions.setRoom(id));
}