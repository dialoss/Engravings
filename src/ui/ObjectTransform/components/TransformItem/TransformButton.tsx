//@ts-nocheck
import React, {useEffect, useRef} from 'react';

const TransformButton = ({children, type, secure, ...props}) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        let origin = ref.current;
        if (type === 'move' && !origin.classList.contains("transform-origin"))
            origin = ref.current.querySelector('.transform-origin');
        origin && origin.addEventListener('mousedown', e => {
            console.log(type, origin)
            if (e.button !== 0 || window.actions.elements.transformed) return;
            window.actions.elements.init(e, origin, type);
        });
    }, []);

    return (
        <div {...props} ref={ref}>
            {children}
        </div>
    );
};

export default TransformButton;