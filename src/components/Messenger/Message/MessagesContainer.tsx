//@ts-nocheck
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
        query.data().messages.forEach(msg => newMessages.push(msg));
        newMessages = newMessages.sort((a,b) => a.timeSent - b.timeSent);
        console.log(newMessages)
        callback(s => ({...s, [id]: {...s[id], messages: newMessages}}));
    });
}

export const BaseMessagesContainer = ({id, document, callback, leaveSnapshot=false}) => {
    const [store, setStore] = useState({});
    useLayoutEffect(() => {
        if (!id || !document) return;
        if (!store[id]) {
            const config = () => {
                setStore(s => ({...s, [id]: {
                        unsubscribe: getMessagesSnapshot(id, document, setStore),
                        messages: [],
                    }}));
            }
            const it = setInterval(() => {
                fetch();
            }, 1000);
            function fetch() {
                try {
                getDoc(document).then(q => {
                    clearInterval(it);
                    if (q.data()) {
                        config();
                    } else {
                        setDoc(document, {messages: []}).then(() => config());
                    }
                });
                } catch (e) {}
            }
            fetch();
        } else {
            // if (leaveSnapshot) store[id].unsubscribe();
        }
        return () => {
            // Object.values(store).forEach(r => r.unsubscribe());
        }
    }, [id, document]);
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