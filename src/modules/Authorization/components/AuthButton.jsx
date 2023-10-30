import React from 'react';
import "./AuthButton.scss";

const AuthButton = ({children, callback, type}) => {
    return (
        <button className={"auth-button auth-button--" + type} onClick={callback}>{children}</button>
    );
};

export default AuthButton;