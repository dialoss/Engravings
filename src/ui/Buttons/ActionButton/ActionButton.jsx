import React from 'react';
import './ActionButton.scss';
import {useSelector} from "react-redux";
import {triggerEvent} from "../../../helpers/events";

const ActionButton = ({children, authorizeAction, className, ...props}) => {
    const user = useSelector(state => state.users.current);
    if (authorizeAction) {
        className += 'modal__toggle-button';
        const f = props.onClick;
        props.onClick = (e) => {
            if (!user.authenticated) {
                triggerEvent('user-auth', true);
                return;
            }
            f(e);
        }
    }
    return (
        <button {...props} className={"action-button " + className || ''}>{children}</button>
    );
};

export default ActionButton;