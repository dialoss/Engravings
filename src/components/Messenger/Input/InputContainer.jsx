import React, {useCallback, useEffect, useRef, useState} from 'react';
import store from "store";
import {useAddEvent} from "../../../hooks/useAddEvent";
import {clearTextFromHTML} from "../../../ui/TextEditor/helpers";
import {triggerEvent} from "../../../helpers/events";
import {doc, updateDoc, arrayRemove, arrayUnion} from "firebase/firestore";
import {loginForm} from "../../../modules/Authorization/forms/loginForm";
import {getMediaType} from "../../../modules/FileExplorer/api/google";

const emptyMessage = {text:'', upload:[]};

const InputContainer = ({extraFields={}, manager, children, closeCallback}) => {
    const [message, setMessage] = useState(emptyMessage);
    const mRef = useRef();
    mRef.current = message;

    async function handleMessage() {
        let {text, upload} = mRef.current;
        const user = store.getState().users.current;
        if (!user.id) {
            triggerEvent('user-auth', true);
            return;
        }
        const [messageSubmit, response] = await manager.config.messageSubmit(message);
        if (!messageSubmit) {
            let form = {};
            if (response === 'time') form = 'Подтвердите, что вы человек';
            if (response === 'upload') form = 'Максимальный размер файла 50мб';
            triggerEvent("user-prompt", {title:form, button: 'ok'});
            return;
        }
        if (manager.config.clearHTML) text = clearTextFromHTML(text);
        if (!clearTextFromHTML(text)) text = '';
        setMessage(emptyMessage);
        if (!text && !upload.length) return;

        let uploadData = upload.map(u => ({
            url: '',
            type: getMediaType(u.name),
            filename: u.name,
            uploading: true,
        }))
        let msg = await manager.sendMessage({
            message: {
                text,
                upload: uploadData,
            },
            user_id: user.id,
            extraFields,
        });
        console.log(uploadData)
        upload.forEach((u, i) => {
            const document = manager.config.getDocument();
            u.msg_id = msg.id;
            u.index = i;
            manager.uploadMedia(u).then(data => {
                updateDoc(doc(manager.db, document), {messages: arrayRemove(structuredClone(msg))});
                uploadData[i] = {
                    ...uploadData[i],
                    url: data.url,
                    uploading: false,
                    media_width: data.media_width,
                    media_height: data.media_height,
                }
                updateDoc(doc(manager.db, document), {messages: arrayUnion({
                        ...msg,
                        value: {
                            text,
                            upload: uploadData,
                        }
                    })});
            });
        });
        manager.config.onsuccess(msg);
        closeCallback && closeCallback();
    }

    const lastInput = useRef();
    function handleKeydown(event) {
        if (!lastInput.current) lastInput.current = {time: 0, f: () => {}, isTyping: false};
        if (event.detail.keyCode === 13) {
            manager.config.userNoTyping();
            lastInput.current.isTyping = false;
            clearTimeout(lastInput.current.f);
            handleMessage();
        } else {
            if (!lastInput.current.isTyping) {
                lastInput.current.isTyping = true;
                manager.config.userTyping();
            }
            clearTimeout(lastInput.current.f);
            lastInput.current.f = setTimeout(() => {
                manager.config.userNoTyping();
                lastInput.current.isTyping = false;
            }, 5000);
        }
    }
    // console.log(message)
    useAddEvent("messenger:keydown", handleKeydown);
    return (
        <>
            {React.createElement(children, {
                sendCallback: handleMessage,
                inputCallback: setMessage,
                message,
            })}
        </>
    );
};

export default InputContainer;