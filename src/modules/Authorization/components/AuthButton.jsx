import React from 'react';
import "./AuthButton.scss";
import {ReactComponent as Icon} from "./icon.svg";

export const GoogleIcon = () => {
    return (
        <div className={'google-icon'}><Icon></Icon></div>
    );
}

const AuthButton = ({children, callback, type}) => {
    return (
        <button className={"auth-button auth-button--" + type} onClick={callback}>{children}</button>
    );
};

export default AuthButton;