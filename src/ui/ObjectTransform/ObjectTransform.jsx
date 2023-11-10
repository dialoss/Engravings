import React, {useEffect, useRef} from 'react';
import {getElementFromCursor, triggerEvent} from "helpers/events";
import {useAddEvent} from "hooks/useAddEvent";
import {setItemTransform} from "./transform";
import {initContainerDimensions} from "./helpers";

const ObjectTransform = () => {
    const prevTransform = useRef();
    function initTransform(event) {
        const btn = event.detail.btn;
        const item = btn.closest(".transform-item");
        const alreadyFocused = item.classList.contains('focused');
        if (prevTransform.current) {
            prevTransform.current.classList.remove('focused');
        }
        item.classList.add('focused');
        prevTransform.current = item;
        triggerEvent("action:init", event.detail.event);

        const parentCont = item.closest('.transform-container').classList.contains('viewport-container');
        if (getElementFromCursor(event, 'ql-container') || event.detail.event.button !== 0 || (event.detail.type === 'move' &&
                !event.detail.movable)) {
            return;
        }
        (alreadyFocused || parentCont) && setItemTransform(event.detail.event, event.detail.type, item, btn);
    }

    function initContainer(event) {
        initContainerDimensions(event.detail);
    }

    useAddEvent("container:init", initContainer);
    useAddEvent("transform:init", initTransform);

    return (
        <></>
    );
};

export default ObjectTransform;