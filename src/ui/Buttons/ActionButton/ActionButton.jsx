import React from 'react';
import './ActionButton.scss';

const ActionButton = ({children, className, ...props}) => {
    return (
        <button {...props} className={"action-button " + className || ''}>{children}</button>
    );
};

export default ActionButton;