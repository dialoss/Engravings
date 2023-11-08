import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import MessageBlock from "./MessageBlock";
import {useSelector} from "react-redux";

const MessagesField = ({messages}) => {
    const {user, room, users} = useSelector(state => state.messenger);
    const ref = useRef();
    useLayoutEffect(() => {
        ref.current.scrollIntoView({behavior: 'instant', block:'nearest'});
    }, [messages, room]);
    return (
        <div className="messages-inner">
            <div className={"messages-field"}>
                <div className="messages-field__wrapper">
                    <div className={'anchor-top'}></div>
                    {
                        messages.map(message => {
                            let side = 'left';
                            if (message.user === user.id) {
                                side = 'right'
                            }
                            return <MessageBlock message={message} side={side} key={message.id}></MessageBlock>
                        })
                    }
                    <div className={'anchor-bottom'} ref={ref}></div>
                </div>
            </div>
        </div>
    );
};

export default MessagesField;