import React, {useState} from 'react';
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {ReactComponent as MessageIcon} from "./message.svg";
import "./OpenButton.scss";
import {useAddEvent} from "../../../hooks/useAddEvent";

const OpenButton = ({callback}) => {
    const [notif, setNotif] = useState(false);
    useAddEvent('messenger:notification', (v) => setNotif(v));
    return (
        <ActionButton onClick={callback} className={'messenger-open__button'}>
            {notif && <div className={'notification-icon'}></div>}
            <MessageIcon></MessageIcon>
        </ActionButton>
    );
};

export default OpenButton;