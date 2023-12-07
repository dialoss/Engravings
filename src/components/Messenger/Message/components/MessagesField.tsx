import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import MessageBlock from "./MessageBlock";
import {useSelector} from "react-redux";
import {useAddEvent} from "../../../../hooks/useAddEvent";
import DelayedVisibility from "../../../../ui/DelayedVisibility/DelayedVisibility";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const MessagesField = ({messages}) => {
    const {user, room} = useSelector(state => state.messenger);
    const ref = useRef();
    function scrollInto(behavior) {
        ref.current && ref.current.scrollIntoView({behavior, block:'nearest'});
    }
    function scroll(behavior, timeout) {
        if (!timeout) {
            scrollInto(behavior);
        } else {
            setTimeout(() => scrollInto(behavior), timeout);
        }
    }
    useLayoutEffect(() => {
        scroll('instant', 0);
    }, [messages.length, room]);

    useAddEvent('messenger:scroll', () => scroll('smooth', 200));
    return (
        <div className="messages-inner scrollable">
            {!!messages.length && <div className={"messages-field"}>
                <DelayedVisibility timeout={200}
                                   trigger={room.id}
                                   className={"messages-field"}>
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
                </DelayedVisibility>
            </div>}
        </div>
    );
};

export default MessagesField;