import React, {useEffect, useRef} from 'react';
import {getElementFromCursor, isMobileDevice, triggerEvent} from "helpers/events";
import {useAddEvent} from "hooks/useAddEvent";
import {setItemTransform} from "./transform";
import {initContainerDimensions} from "./helpers";

const ObjectTransform = () => {
    const prevTransform = useRef();
    function clearSelection() {
        if (prevTransform.current) {
            prevTransform.current.classList.remove('focused');
        }
    }
    function initTransform(event) {
        const btn = event.detail.btn;
        const item = btn.closest(".transform-item");
        const alreadyFocused = item.classList.contains('focused');
        clearSelection();
        item.classList.add('focused');
        if (item.getAttribute('data-type') !== 'modal' &&
            isMobileDevice() &&
            !getElementFromCursor(event.detail.event, 'action-button')) triggerEvent("contextmenu:open", event.detail.event);

        prevTransform.current = item;
        triggerEvent("action:init", event.detail.event);
        window.elementsAction = true;

        const parentCont = item.closest('.transform-container').classList.contains('viewport-container');
        if (getElementFromCursor(event, 'ql-container') || event.detail.event.button !== 0 ||
            (event.detail.type === 'move' && !event.detail.movable) ||  (event.detail.type === 'resize' && !event.detail.resizable)) {
            return;
        }
        (alreadyFocused || parentCont) && setItemTransform(event.detail.event, event.detail.type, item, btn);
    }

    function initContainer(event) {
        initContainerDimensions(event.detail);
    }

    useAddEvent("mousedown", e => {
        const el = getElementFromCursor(e, '.transform-item');
        if (!el || el.getAttribute('data-type') === 'modal') {
            clearSelection();
            window.elementsAction = false;
        }
    })

    useAddEvent("container:init", initContainer);
    useAddEvent("transform:init", initTransform);

    return (
        <></>
    );
};

export default ObjectTransform;