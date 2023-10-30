import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Messenger from "components/Messenger/Messenger";
import {
    updateUser,
    useGetRooms,
    useGetUsers,

} from "./api/firebase";
import {ModalManager} from "components/ModalManager";
import {isMobileDevice, triggerEvent} from "../../helpers/events";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "./store/reducers";
import store from "../../store";
import {onDisconnect, ref, serverTimestamp} from "firebase/database";
import {realtime} from "./api/config";
import OpenButton from "./OpenButton/OpenButton";

const MessengerContainer = () => {
    const {users} = useSelector(state => state.messenger);
    const user = useSelector(state => state.users.current);
    const dispatch = useDispatch();
    useGetUsers();

    useLayoutEffect(() => {
        let messengerUser = users[user.id];
        if (!messengerUser) return;
        dispatch(actions.setField({field:'user', data: structuredClone(messengerUser)}));
        updateUser('realtime', {lastSeen: serverTimestamp(), online:true});
        onDisconnect(ref(realtime, 'users/' + user.id)).update({lastSeen: serverTimestamp(), online:false});
    }, [Object.values(users).length, user]);

    const windowName = "messenger-window:toggle";
    const [openMessenger, setOpen] = useState(false);
    return (
        <>
            <OpenButton callback={() => setOpen(!openMessenger)}></OpenButton>
            <ModalManager transform={isMobileDevice() ? null : {position:'fixed', left:'20', top:'150', width:'50', zIndex:8}}
                          name={windowName}
                          callback={(isOpened) => setOpen(isOpened)}
                          defaultOpened={openMessenger}
                          closeConditions={['btn', 'esc']}>
                <Messenger style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}></Messenger>
            </ModalManager>
        </>
    );
};

export default MessengerContainer;