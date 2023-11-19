import React, {useEffect, useRef} from 'react';
import {getElementFromCursor, triggerEvent} from "helpers/events";

const TransformButton = ({children, type, secure, ...props}) => {
    const ref = useRef();
    function transformCallback(event) {
        if (secure && !window.editPage) return;
        event.stopPropagation();
        triggerEvent("context-window:toggle:check-opened", (isOpened) => {
            if (!getElementFromCursor(event, 'context-menu') && isOpened) {
                triggerEvent('context-window:toggle', {isOpened: false});
            }
        })
        triggerEvent("transform:init", {event, type, btn:ref.current, movable: (props.style ||{}).movable});
    }

    useEffect(() => {
        if (type === 'move') ref.current.querySelector(".transform-origin").addEventListener('mousedown', transformCallback);
        else ref.current.addEventListener('mousedown', transformCallback);
    }, []);

    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    );
};

export default TransformButton;