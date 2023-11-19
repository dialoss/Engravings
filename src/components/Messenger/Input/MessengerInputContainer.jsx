import React, {useRef} from "react";
import {MessageManager, updateRoom, updateUser} from "../api/firebase";
import {useAddEvent} from "../../../hooks/useAddEvent";
import {actions} from "../store/reducers";
import MessengerInput from "./MessengerInput";
import InputContainer from "./InputContainer";
import store from "store";
import {getGlobalTime, sendEmail} from "../../../api/requests";
import {triggerEvent} from "../../../helpers/events";
import {getLocation} from "../../../hooks/getLocation";
import {sendCloudMessage} from "../api/notifications";

export const MessengerInputContainer = () => {
    let config = {
        onsuccess: (message) => {
            const {room, user, users} = store.getState().messenger;
            sendCloudMessage({
                title: 'MyMount | Новое сообщение',
                body: user.name + ': ' + (message.value.text || message.value.upload.filename),
                data: {url: getLocation().fullURL + '?action=messenger'},
                companion: users[room.companion].email,
            });
            updateRoom({lastMessage: message, newMessage: true, notified:false});
            const location = getLocation();
            sendEmail({
                recipient: users[room.companion].email,
                type: 'message',
                subject: 'MyMount | Новое сообщение',
                data: {
                    message: message.value.text,
                    reply: location.fullURL,
                    user,
                    room,
                }
            })
        },
        getDocument: () => store.getState().messenger.room.messages,
        userNoTyping: () => {
            updateUser('realtime', {isTyping: false});
        },
        userTyping: () => {
            updateUser('realtime', {isTyping: true});
        },
        clearHTML: true,
        messageSubmit: async (message) => {
            let f = message.upload[0];
            if (f && f.size > 50 * 1024 * 1024) return [false, 'upload'];
            let lastTime = store.getState().messenger.room.lastMessage.timeSent;
            if (!lastTime) return [true, 'time'];
            let curTime = await getGlobalTime();
            let a = new Date(new Date(curTime.datetime).toISOString()).getTime() / 1000;
            let b = new Date(new Date(lastTime).toISOString()).getTime() / 1000;
            let prompt = false;
            triggerEvent('user-prompt:toggle:check-opened', (isOpened) => prompt = isOpened);
            if (prompt) return [false, 'time'];
            return [!lastTime || !(a - b < 0.5), 'time'];
        },
    }
    const manager = new MessageManager('messenger', actions, config);
    return (
        <InputContainer children={MessengerInput} manager={manager}></InputContainer>
    );
}