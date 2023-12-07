import React from 'react';
import './WindowButton.scss';
import burger from './assets/burger.svg';
import cross from './assets/cross.svg';

const ComponentSVG = {
    'open': burger,
    'close': cross,
}

const WindowButton = ({type, ...props}) => {
    return (
        <button {...props} className={`window-button window-${type} ${props.className}`}>
            <img src={ComponentSVG[type]} alt={""}/>
        </button>
    );
};

export default WindowButton;