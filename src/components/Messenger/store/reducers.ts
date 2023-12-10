//@ts-nocheck
import {createSlice} from "@reduxjs/toolkit";


const emptyRoom = {picture: '', title: '', id: '', lastMessage: ''};

export interface IMessageUpload {
    filename: string;
    media_height: number;
    media_width: number;
    type: string;
    uploading: boolean;
    url: string;
}

export interface IMessage {
    id: number;
    timeSent: string;
    user: number;
    text: string;
    upload: IMessageUpload[];
}

export interface IUser extends IUserMeta {
    id: number;
    email: string;
    name: string;
    notification_token: string;
    picture: string;
    rooms: IRoom[];
}

export interface IUserMeta {
    currentRoom: number;
    lastSeen: string;
    online: boolean;
    isTyping: boolean;
}

export interface IRoom extends IRoomMeta {
    id: number;
    messages: string;
    picture: string;
    title: string;
    users: string[];
}

export interface IRoomMeta {
    newMessage: boolean;
    lastMessage: IMessage;
    notified: boolean;
}

export interface IMessenger {
    user: IUser,
    users: {[key: number] : IUser};
    rooms: {[key: number] : IRoom};
    room: IRoom;
    rooms_raw: {[key: number] : IRoom};
    messages: IMessage[];
    message: IMessage;
}

export const messengerSlice = createSlice({
    name: "messenger",
    initialState: {
        user: {},
        users: {},
        rooms: {},
        room: {},
        rooms_raw: {},
        messages: [],
        message: {
            text: '',
            upload: [],
        },
    } as IMessenger,
    reducers: {
        setMessage: (state: IMessenger, {payload: data}) => {
            return {...state, message: {...state.message, ...data}};
        },
        setField: (state, {payload: {field, data}}) => {
            return {...state, [field]: data};
        },
        setRoom: (state, {payload: id}) => {
            if (id === -1) {
                return {...state, room: emptyRoom};
            }
            return {...state, room: state.rooms[id]};
        },
        setUsersMeta: (state, {payload: {data}}) => {
            let users = {...state.users};
            Object.keys(data).forEach(k => {
                if (!!users[k]) users[k] = {...users[k], ...data[k]};
            })
            return {...state, users: users};
        }
    }
});

export const { actions, reducer } = messengerSlice;