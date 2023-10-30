import React, {useRef, useState} from 'react';
import "./Avatar.scss";
import {useLongPress} from "helpers/events";

const Avatar = ({style, extraInfo=false, symbol='', children, ...props}) => {
    let src = props.src;
    const [hover, setHover] = useState('');
    const {onTouchEnd, onMouseUp, ...hoverEvents} = useLongPress((e) => {setHover('hover')}, (e) => {},
        {shouldPreventDefault:false, delay: 100});
    hoverEvents.onTouchEnd = (e) => {
        if (hover) e.preventDefault();
        setHover('');
        onTouchEnd(e);
    }
    hoverEvents.onMouseUp = (e) => {
        if (hover) e.preventDefault();
        setHover('');
        onMouseUp(e);
    }
    return (
        <div {...hoverEvents} className={`avatar__wrapper ${hover}`}>
            <div className={"avatar"}>
                {!!src ?
                    <img src={src} alt=""/> :
                    <div className={'placeholder'}>
                        <div className={"placeholder-symbol"}>{symbol}</div>
                    </div>
                }
            </div>
            {extraInfo && <div className={'info'}>
                {children}
            </div>}
        </div>
    );
};

export default Avatar;