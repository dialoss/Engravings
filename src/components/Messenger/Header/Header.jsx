import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import "./Header.scss"
import Avatar from "ui/Avatar/Avatar";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import MessageBlock from "../Message/components/MessageBlock";
import {useSelector} from "react-redux";
import TextLoader from "../../../ui/TextLoader/TextLoader";

const MessengerHeader = () => {
    const {room, users} = useSelector(state => state.messenger);
    const companion = users[room.companion] || {};
    return (
        <div className={"messenger-header transform-origin"}>
            {room.title && <Avatar src={room.picture} user={companion} style={{width:50, height:50}}></Avatar>}
            <div className={'header-block'}>
                <p className={"title"}>{room.title}</p>
                {room.id === companion.currentRoom &&
                    <TextLoader className={"message-typing"} isLoading={companion.isTyping}>Печатает</TextLoader>
                }
            </div>
            <WindowButton type={'close'}></WindowButton>
        </div>
    );
};

export default MessengerHeader;