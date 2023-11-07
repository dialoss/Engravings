import React, {useEffect, useRef} from 'react';
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "hooks/useAddEvent";
import {setItemTransform} from "./transform";
import {initContainerDimensions} from "./helpers";
import {prevElement} from "../../modules/ActionManager/components/helpers";

const ObjectTransform = () => {
    function initTransform(event) {
        const btn = event.detail.btn;
        const item = btn.closest(".transform-item");
        console.log(prevElement)
        prevElement.html && (prevElement.html.closest('.transform-item').style.zIndex = 1);
        item.style.zIndex = 5;
        setItemTransform(event.detail.event, event.detail.type, item, btn);
        triggerEvent("action:init", event.detail.event);
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