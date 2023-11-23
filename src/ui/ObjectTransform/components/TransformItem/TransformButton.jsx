import React, {useEffect, useRef} from 'react';
import {getElementFromCursor, triggerEvent} from "helpers/events";

const TransformButton = ({children, type, secure, ...props}) => {
    const ref = useRef();
    function transformCallback(event) {
        if (secure && !window.editPage) return;
        event.stopPropagation();
        triggerEvent("context-window:check-opened", (isOpened) => {
            if (!getElementFromCursor(event, 'context-menu') && isOpened) {
                triggerEvent('context-window:toggle', {isOpened: false});
            }
        })
        triggerEvent("transform:init", {event, type, btn:ref.current, movable: (props.style ||{}).movable});
    }

    useEffect(() => {
        const origin = ref.current.querySelector(".transform-origin");
        if (type === 'move') origin && origin.addEventListener('mousedown', transformCallback);
        else ref.current.addEventListener('mousedown', transformCallback);
    }, []);

    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    );
};

export default TransformButton;