import React, {useCallback, useEffect, useRef, useState} from 'react';
import store from "store";
import {useAddEvent} from "../../../hooks/useAddEvent";
import {clearTextFromHTML} from "../../../ui/TextEditor/helpers";
import {triggerEvent} from "../../../helpers/events";
import {getFileType} from "../../../helpers/files";
import {doc, updateDoc, arrayRemove, arrayUnion} from "firebase/firestore";
import {loginForm} from "../../../modules/Authorization/forms/loginForm";

const emptyMessage = {text:'', upload:[]};

const InputContainer = ({extraFields={}, manager, children}) => {
    const [message, setMessage] = useState(emptyMessage);
    const mRef = useRef();
    mRef.current = message;

    async function handleMessage() {
        let {text, upload} = mRef.current;
        upload = upload[0];
        const user = store.getState().users.current;
        if (!user.id) {
            triggerEvent('user-prompt', loginForm);
            return;
        }
        const [messageSubmit, response] = await manager.config.messageSubmit(message);
        if (!messageSubmit) {
            let form = {};
            if (response === 'time') form = 'Подтвердите, что вы человек';
            if (response === 'upload') form = 'Максимальный размер файла 50мб';
            triggerEvent("user-prompt", {text:form});
            return;
        }
        if (manager.config.clearHTML) text = clearTextFromHTML(text);
        if (!text.trim() && !upload) return;
        setMessage(emptyMessage);

        let uploadData = upload ? {
            url: '',
            type: getFileType(upload.name),
            filename: upload.name,
            uploading: true,
        } : {};
        let msg = await manager.sendMessage({
            message: {
                text,
                upload: uploadData,
            },
            user_id: user.id,
            extraFields,
        });
        if (upload) {
            const document = manager.config.getDocument();
            console.log(document)
            manager.uploadMedia(upload).then(uploadUrl => {
                updateDoc(doc(manager.db, document), {messages: arrayRemove(msg)});
                updateDoc(doc(manager.db, document), {messages: arrayUnion({
                        ...msg,
                        value: {
                            text,
                            upload: {
                                ...uploadData,
                                url: uploadUrl,
                                uploading: false,
                            }
                        }
                    })});
            });
        }
        manager.config.onsuccess(msg);
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
    console.log(message)
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