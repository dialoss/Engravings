//@ts-nocheck
import React from 'react';

import "./Messenger.scss";

import MessengerHeader from "./Header/Header";
import MessengerSidebar from "./Sidebar/MessengerSidebar";
import MessagesContainer from "./Message/MessagesContainer";
import {useAppSelector} from "hooks/redux";
import {MessengerInputContainer} from "./Input/MessengerInputContainer";
import {useGetRooms} from "./api/firebase";

const Messenger = () => {
    useGetRooms();
    const {room} = useAppSelector(state => state.messenger);

    return (
        <div className={"messenger"}>
            <MessengerSidebar></MessengerSidebar>
            <div className="wrapper">
                <div className={"messenger-block"}>
                    <MessengerHeader room={room}></MessengerHeader>
                    <MessagesContainer room={room}></MessagesContainer>
                    {!!room.id && <MessengerInputContainer></MessengerInputContainer>}
                </div>
            </div>
        </div>
    );
};

export default Messenger;