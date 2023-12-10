//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import Messenger from "components/Messenger/Messenger";
import {updateUser, useGetUsers,} from "./api/firebase";
import {ModalManager} from "components/ModalManager";
import {isMobileDevice, triggerEvent} from "../../helpers/events";
import {useAppDispatch, useAppSelector} from "hooks/redux";
import {actions} from "./store/reducers";
import store from "../../store";
import {onDisconnect, ref, serverTimestamp} from "firebase/database";
import {messaging, realtime} from "./api/config";
import OpenButton from "./OpenButton/OpenButton";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {getToken, onMessage} from "firebase/messaging";
import {notifyUser} from "./api/notifications";

const MessengerContainer = () => {
    const {users} = useAppSelector(state => state.messenger);
    const user = useAppSelector(state => state.users.current);
    const dispatch = useAppDispatch();
    useGetUsers();
    const windowName = "messenger";

    useLayoutEffect(() => {
        let messengerUser = users[user.id];
        if (!messengerUser) return;
        dispatch(actions.setField({field:'user', data: structuredClone(messengerUser)}));
        updateUser('realtime', {lastSeen: serverTimestamp(), online:true});
        onDisconnect(ref(realtime, 'users/' + user.id)).update({lastSeen: serverTimestamp(), online:false, isTyping:false});
        if (messaging) {
            getToken(messaging, {vapidKey: 'BCW_SE0Ya79VLvyQcUhvaHz3pLqo2JN3f4o6UmaxwT5gTHinwgr3TJwtz6TKRf8aXmrqmA-DfOaiOY_btNVYK6M'}).then((currentToken) => {
                if (currentToken) {
                    updateUser('firestore', {notification_token: currentToken});
                }
            })
            onMessage(messaging, (payload) => {
                if (store.getState().messenger.room.id === +payload.data.room &&
                    document.querySelector(windowName + '.opened')) return;
                notifyUser({...payload.notification, data: payload.data});
            })
        }
    }, [Object.values(users).length, user]);

    return (
        <>
        {!isMobileDevice() && <OpenButton callback={() => window.modals.toggle(windowName)}></OpenButton>}
            <ModalManager name={windowName}
                          style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}
                          closeConditions={['btn', 'esc']}>
                <TransformItem style={isMobileDevice() ? {} : {position:'fixed', right:'5%', bottom:'250px', width:'auto', zIndex:8}}
                                type={'modal'}>
                    <Messenger></Messenger>
                </TransformItem>
            </ModalManager>
        </>
    );
};

export default MessengerContainer;