import React, {useEffect, useRef} from 'react';
import {triggerEvent} from "helpers/events";

const TransformButton = ({children, type, ...props}) => {
    const ref = useRef();

    useEffect(() => {
        let origin = ref.current;
        if (type === 'move') origin = ref.current.querySelector('.transform-origin');
        origin && origin.addEventListener('mousedown', e => {
            // if (props.secure) return;
            e.stopPropagation();
            triggerEvent('action:init', e);
            triggerEvent("transform:init", {event: e, origin, type});
        });
    }, []);

    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    );
};

export default TransformButton;