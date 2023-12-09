import React, {useContext, useLayoutEffect, useRef, useState} from 'react';
import "./Header.scss"
import Avatar from "ui/Avatar/Avatar";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import MessageBlock from "../Message/components/MessageBlock";
import {useAppSelector} from "hooks/redux";
import TextLoader from "../../../ui/TextLoader/TextLoader";
import dayjs from "dayjs";

const MessengerHeader = () => {
    const {room, users} = useAppSelector(state => state.messenger);
    const companion = users[room.companion] || {};
    const lastTime = companion.lastSeen;
    const online = companion.online;
    return (
        <div className={"messenger-header transform-origin"}>
            {room.title && <>
                <Avatar src={room.picture} user={companion} style={{width:50, height:50}}></Avatar>
            <div className={'header-block'}>
                <p className={"title"}>{room.title}</p>
                {room.id === companion.currentRoom && companion.isTyping ?
                    <TextLoader className={"message-typing"} isLoading={companion.isTyping}>Печатает</TextLoader> :
                    <span className={'lastseen'}>{!online ? 'Был в сети ' +
                        (lastTime?dayjs(lastTime).format("HH:mm DD.MM"):'') : 'Онлайн'}
                    </span>
                }
            </div>
                </>}
            <WindowButton type={'close'}></WindowButton>
        </div>
    );
};

export default MessengerHeader;