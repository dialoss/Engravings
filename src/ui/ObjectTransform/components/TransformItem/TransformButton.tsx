//@ts-nocheck
import React, {useEffect, useRef} from 'react';

const TransformButton = ({children, type, ...props}) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        let origin = ref.current;
        console.log(ref.current.querySelectorAll('.transform-origin'))
        if (type === 'move' && !origin.classList.contains("transform-origin"))
            origin = [...ref.current.querySelectorAll('.transform-origin')].slice(-1)[0];
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