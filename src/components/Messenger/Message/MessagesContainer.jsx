import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
    onSnapshot,
    doc,
    setDoc,
    getDoc,
} from "firebase/firestore";
import {MDB} from "../api/config";
import MessagesField from "./components/MessagesField";
import "./components/MessagesField.scss";

function getMessagesSnapshot(id, document, callback) {
    return onSnapshot(document, query => {
        let newMessages = [];
        query.data().messages.forEach(msg => {
            let url = msg.value.upload.url;
            if (!!url) {
                let name = url.split('/').slice(-1)[0];
                if (!url.includes('drive.google')) msg.value.upload.url =
                    `https://firebasestorage.googleapis.com/v0/b/mymount-d1cad.appspot.com/o/uploads%2Fmessages%2F${name}?alt=media`
            }
            newMessages.push(msg);
        });
        // console.log('snapshot messages' , newMessages);
        newMessages = newMessages.sort((a,b) => {
            if (a.timeSent < b.timeSent) return -1;
            if (a.timeSent > b.timeSent) return 1;
            return 0;
        })
        callback(s => ({...s, [id]: {...s[id], messages: newMessages}}));
    });
}

export const BaseMessagesContainer = ({id, document, callback, leaveSnapshot=false}) => {
    const [store, setStore] = useState({});
    useLayoutEffect(() => {
        if (!id) return;
        if (!store[id]) {
            const config = () => {
                setStore(s => ({...s, [id]: {
                        unsubscribe: getMessagesSnapshot(id, document, setStore),
                        messages: [],
                    }}));
            }
            const it = setInterval(() => {
                getDoc(document).then(q => {
                    clearInterval(it);
                    if (q.data()) {
                        config();
                    } else {
                        setDoc(document, {messages: []}).then(() => config());
                    }
                });
            }, 1000);
        } else {
            if (leaveSnapshot) store[id].unsubscribe();
        }
        return () => {
            // Object.values(store).forEach(r => r.unsubscribe());
        }
    }, [id]);
    useLayoutEffect(() => {
        store[id] && callback(store[id].messages);
    }, [store, id]);
    return (<></>);
}

const MessagesContainer = ({room}) => {
    const [messages, setMessages] = useState([]);
    return (
        <>
            <BaseMessagesContainer id={room.id} document={doc(MDB, room.messages || 'default')} callback={setMessages}>
            </BaseMessagesContainer>
            <div className="messages-wrapper">
                <div className={"background"}>
                    <div className="pattern"></div>
                </div>
                {room.id ? <MessagesField messages={messages}></MessagesField> :
                    <div className={"chat-empty"}>
                        выберите чат
                    </div>}
            </div>
        </>
    );
};

export default MessagesContainer;