import React from 'react';

import "./Messenger.scss";

import MessengerHeader from "./Header/Header";
import MessengerSidebar from "./Sidebar/MessengerSidebar";
import MessagesContainer from "./Message/MessagesContainer";
import {useSelector} from "react-redux";
import {MessengerInputContainer} from "./Input/MessengerInputContainer";
import {useGetRooms} from "./api/firebase";

const Messenger = () => {
    useGetRooms();
    const {room} = useSelector(state => state.messenger);
    console.log(room)
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