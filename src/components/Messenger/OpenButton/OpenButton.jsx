import React, {useEffect, useState} from 'react';
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {ReactComponent as MessageIcon} from "./message.svg";
import "./OpenButton.scss";
import {useAddEvent} from "../../../hooks/useAddEvent";

const OpenButton = ({callback}) => {
    const [notif, setNotif] = useState(false);
    useAddEvent('messenger:notification', (v) => setNotif(v.detail));
    const [style, setStyle] = useState({});
    useEffect(() => {
        let target = document.querySelector('.footer');
        let options = {
            rootMargin: "0px",
            threshold: 0,
        };
        function callback(entries, observer) {
            let e = entries[0];
            if (e.isIntersecting) {
                setStyle({position: 'absolute'});
            } else {
                setStyle({position: 'fixed'});
            }
        }
        const observer = new IntersectionObserver(callback, options);
        observer.observe(target);
        return () => observer.unobserve(target);
    }, []);

    return (
        <ActionButton onClick={callback} className={'messenger-open__button'} style={style}>
            {notif && <div className={'notification-icon'}></div>}
            <MessageIcon></MessageIcon>
        </ActionButton>
    );
};

export default OpenButton;