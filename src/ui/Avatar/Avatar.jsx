import React, {useRef, useState} from 'react';
import "./Avatar.scss";
import {useLongPress} from "helpers/events";
import Jdenticon from "react-jdenticon";

const Avatar = ({style, user={}, extraInfo=false, symbol='', children, ...props}) => {
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
                        <Jdenticon size="40" value={(user.name + user.email) || 'a'} />
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