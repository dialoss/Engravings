import React, {useEffect, useRef} from 'react';

const TransformButton = ({children, type, secure, ...props}) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        let origin = ref.current;
        // if (type === 'move') origin = ref.current.querySelector('.transform-origin');
        origin && origin.addEventListener('mousedown', e => {
            // e (props.secure) return;
            if (e.button !== 0) return;
            e.stopPropagation();
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