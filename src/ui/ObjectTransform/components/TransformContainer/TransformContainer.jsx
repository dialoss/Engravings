import React, {useRef} from 'react';
import {useAddEvent} from "hooks/useAddEvent";
import {initContainerDimensions} from "../../helpers";
import "./TransformContainer.scss";

const TransformContainer = ({children, className, ...props}) => {
    const ref = useRef();
    function resizeContainer() {
        initContainerDimensions({container: ref.current, resize:true})
    }
    useAddEvent('resize', resizeContainer, {passive: true});
    return (
        <div className={"transform-container " + (className || '')}
             {...props}
             ref={ref}>
            {children}
        </div>
    );
};

export default TransformContainer;