import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import MessageBlock from "./MessageBlock";
import {useSelector} from "react-redux";
import {useAddEvent} from "../../../../hooks/useAddEvent";
import DelayedVisibility from "../../../../ui/DelayedVisibility/DelayedVisibility";

const MessagesField = ({messages}) => {
    const {user, room} = useSelector(state => state.messenger);
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    function scroll(behavior, timeout) {
        setTimeout(() => {
            ref.current.scrollIntoView({behavior, block:'nearest'});
        }, timeout);
    }
    useLayoutEffect(() => {
        scroll('instant', 0);
    }, [messages, room]);
    useLayoutEffect(()=>{
        setVisible(false)
        setTimeout(()=>{setVisible(true)},10);
    }, [room]);
    useAddEvent('messenger:scroll', () => scroll('smooth', 150));
    return (
        <DelayedVisibility timeout={200} trigger={room}>

        <div className="messages-inner scrollable">
            <div className={"messages-field " + (visible ? 'visible':'hidden')}>
                <div className="messages-field__wrapper">
                    <DelayedVisibility timeout={10} trigger={visible}>
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
                    </DelayedVisibility>
                </div>
            </div>
        </div>
        </DelayedVisibility>

    );
};

export default MessagesField;