import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Modal.scss';
import {getElementFromCursor} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";

const Modal = ({content, name, isOpened, closeCallback}) => {
    const ref = useRef();
    const windowRef = useRef();
    const props = content.props.style;
    const opened = (isOpened ? "opened" : "");

    function backgroundClose(event) {
        const toggle = getElementFromCursor(event, 'modal__toggle-button');
        !toggle && closeCallback();
        if (props.bg !== 'bg-none') event.stopPropagation();
    }
    useAddEvent("mousedown", (e) => {
        const toggle = getElementFromCursor(e, 'modal__toggle-button');
        const mod = getElementFromCursor(e, name);
        !mod && !toggle && props.bg === 'bg-none' && closeCallback();
    });

    useEffect(() => {
        const transformItem = windowRef.current.closest('.transform-item');
        if (!transformItem || name.includes('emojis')) return;
        !isOpened && (transformItem.style.pointerEvents = 'none');
        isOpened && (transformItem.style.pointerEvents = 'auto');
    }, [isOpened]);

    return (
        <div className={"modal"} ref={windowRef}>
            <div className={"modal__wrapper"}>
                <div className={`modal__background ${opened} ${!!props && (props.bg || '')}`}
                     onClick={backgroundClose}>
                    <div className={`modal__window ${name} ${opened} ${!!props && ((props.win || '') + ' ' + (props.bg || ''))}`}
                         onClick={e => e.stopPropagation()}
                         ref={ref}>
                        <div className="modal__content">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;