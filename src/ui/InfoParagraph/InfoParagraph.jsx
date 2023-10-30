import React, {useCallback, useEffect, useRef} from 'react';
import "./InfoParagraph.scss";
import {doubleTap, isTouchDevice, triggerEvent} from "helpers/events";

const InfoParagraph = ({type, children, ...props}) => {
    const ref = useRef();
    const editorCallback = (event) => {
        if (event.detail !== 2) return;
        triggerEvent('text-editor:toggle', {
            event,
            config: (type === "textfield" ? 'editor' : 'simple'),
            isOpened: true,
            props,
            value: ref.current.innerHTML,
            element: ref.current
        });
    }
    useEffect(() => {
        ref.current.innerHTML = children;
    }, [children]);
    // const callback = isTouchDevice() ? {onTouchEnd: editorCallback} : {onMouseDown: editorCallback};
    return (
        <span ref={ref} {...props} key={type}
            onClick={editorCallback}
            className={`info__paragraph info__paragraph-${type}`}></span>
    );
};

export default InfoParagraph;