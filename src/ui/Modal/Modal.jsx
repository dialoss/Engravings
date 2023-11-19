import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Modal.scss';
import {getCorrectedPosition} from "../helpers/viewport";
import {useAddEvent} from "../../hooks/useAddEvent";
import {getElementFromCursor} from "../../helpers/events";

const Modal = ({content, name, isOpened, closeCallback}) => {
    const ref = useRef();
    const windowRef = useRef();
    const opRef = useRef();
    opRef.current = isOpened;
    useEffect(() => {
        let pos = content.props.position;
        if (!pos) return;
        let [px, py] = [pos.left, pos.top];
        [px, py] = getCorrectedPosition(ref.current, [px, py]);
        ref.current.style.left = px + "px";
        ref.current.style.top = py + "px";
    }, [content]);

    const modalName = name.split(':')[0];
    function checkCloseDown(event) {
        // console.log(name)
        if (opRef.current) {
            const mod = getElementFromCursor(event, modalName);
            const toggle = getElementFromCursor(event, 'modal__toggle-button');
            // console.log(name, mod, toggle)
            !mod && !toggle && closeCallback();
        }
    }
    useAddEvent("mousedown", checkCloseDown);
    const props = content.props.style;
    const opened = (isOpened ? "opened" : "");
    useEffect(() => {
        const transformItem = windowRef.current.closest('.transform-item');
        if (!transformItem || name.includes('emojis')) return;
        !isOpened && (transformItem.style.pointerEvents = 'none');
        isOpened && (transformItem.style.pointerEvents = 'auto');
    }, [isOpened]);

    useEffect(() => {
        const contentOuter = ref.current.querySelector('.content-outer');
        contentOuter && windowRef.current.querySelector('.modal__outer').appendChild(contentOuter);
    }, [isOpened]);

    return (
        <div className={"modal"} ref={windowRef}>
            <div className={"modal__wrapper"}>
                <div className={`modal__background ${opened} ${!!props && (props.bg || '')}`}>
                </div>
                <div className={`modal__window ${modalName} ${opened} ${!!props && ((props.win || '') + ' ' + (props.bg || ''))}`} ref={ref}>
                    <div className="modal__content">
                        {content}
                    </div>
                </div>
                <div className={`modal__outer modal__window ${modalName} ${opened}`}></div>
            </div>
        </div>
    );
};

export default Modal;