import React from 'react';
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {ReactComponent as MessageIcon} from "./message.svg";
import "./OpenButton.scss";

const OpenButton = ({callback}) => {
    return (
        <ActionButton onClick={callback} className={'messenger-open__button'}>
            <MessageIcon></MessageIcon>
        </ActionButton>
    );
};

export default OpenButton;