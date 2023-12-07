import React from 'react';
import Message from "./Message";
import "./MessageBlock.scss";

const MessageBlock = ({message, side, className}) => {
    return (
        <div className={`message-block ${className||''} message-block--` + side}>
            <Message data={message}></Message>
        </div>
    );
};

export default MessageBlock;