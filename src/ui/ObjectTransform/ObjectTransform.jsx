import React, {useEffect, useRef} from 'react';
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "hooks/useAddEvent";
import {setItemTransform} from "./transform";
import {initContainerDimensions} from "./helpers";
import store from "store";

const ObjectTransform = () => {
    function initTransform(event) {
        if (!store.getState().users.current.isAdmin) return;
        const btn = event.detail.btn;
        const item = btn.closest(".transform-item");

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