import React, {useRef} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {initContainerDimensions} from "../../helpers";

const TransformContainer = ({children, width, height, className}) => {
    const ref = useRef();
    function resizeContainer() {
        initContainerDimensions({container: ref.current, resize: true})
    }
    useAddEvent('resize', resizeContainer);
    return (
        <div className={"transform-container " + (className || '')} data-height={height} data-width={width} ref={ref}>
            {children}
        </div>
    );
};

export default TransformContainer;