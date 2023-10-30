import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import MessageBlock from "./MessageBlock";
import {useSelector} from "react-redux";

const MessagesField = ({messages, observerCallback}) => {
    const {user, room, users} = useSelector(state => state.messenger);
    let companion = users[room.companion];
    const ref = useRef();
    const obsTarget = useRef();
    const lastHeight = useRef();
    const observer = useRef();
    // useLayoutEffect(() => {
    //     if (!ref.current) return;
    //     lastHeight.current = ref.current.closest('.messages-field__wrapper').getBoundingClientRect().height;
    // }, [messages]);
    //
    // useLayoutEffect(() => {
    //     if (!ref.current) return;
    //     let h = ref.current.closest('.messages-field__wrapper').getBoundingClientRect().height;
    //     ref.current.closest('.messages-inner').scrollTop = h - lastHeight.current;
    //     lastHeight.current = h;
    // }, [messages]);
    //

    // useEffect(() => {
    //     let viewport = obsTarget.current.closest('.messages-inner');
    //     lastHeight.current = ref.current.closest('.messages-field__wrapper').getBoundingClientRect().height;
    //     let options = {
    //         root: viewport,
    //         threshold: 1,
    //     };
    //     let lastTime = 0;
    //     function callback(entries, observer) {
    //         let e = entries[0];
    //         if (!e.isIntersecting || e.time - lastTime < 1) return;
    //         lastTime = e.time;
    //         console.log(entries)
    //         observerCallback();
    //     }
    //     observer.current && observer.current.unobserve(obsTarget.current);
    //     observer.current = new IntersectionObserver(callback, options);
    //     observer.current.observe(obsTarget.current);
    // }, [room]);

    const prevRoom = useRef();
    useLayoutEffect(() => {
        // if (ref.current) {
        //     if (prevRoom.current === room.id) {
        //         ref.current.scrollIntoView({behavior: 'smooth', block:'nearest'});
        //     } else {
                ref.current.scrollIntoView({behavior: 'instant', block:'nearest'});
            // }
        // }
        // messages.length && (prevRoom.current = room.id);
    }, [messages, room]);
    return (
        <div className="messages-inner">
            <div className={"messages-field"}>
                <div className="messages-field__wrapper">
                    <div className={'anchor-top'} ref={obsTarget}></div>
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