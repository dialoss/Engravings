import React, {useEffect, useRef} from 'react';
import {getElementFromCursor, triggerEvent} from "helpers/events";

const TransformButton = ({children, type, ...props}) => {
    const ref = useRef();
    function transformCallback(event) {
        event.stopPropagation();
        const parentCont = ref.current.closest('.transform-container');
        const item = ref.current.closest('.transform-item');
        const cont = item.querySelector('.transform-container');
        if (parentCont.classList.contains('viewport-container') && cont && cont.getAttribute('data-type') === 'base') return;
        if (getElementFromCursor(event, 'ql-container')) return;
        if (event.button !== 0 || (type === 'move' && !props.style.movable)) return;
        triggerEvent("transform:init", {event, type, btn:ref.current});
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