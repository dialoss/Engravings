import React, { useState} from 'react';
import ContextMenu from "./components/ContextMenu/ContextMenu";
import {triggerEvent} from "helpers/events";
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import {getCorrectedPosition} from "../../../ui/helpers/viewport";
import TransformItem from "../../../ui/ObjectTransform/components/TransformItem/TransformItem";

const ContextMenuContainer = ({actions}) => {
    const name = "context-window";
    const modalName = name + ":toggle";
    const [position, setPosition] = useState({left: 0, top: 0});

    function contextMenu(event) {
        event.preventDefault();
        triggerEvent('action:init', event);
        if (!event.ctrlKey) {
            const modal = document.querySelector('.modal__window.' + name + ' .transform-item');
            let [px, py, side] = getCorrectedPosition(modal, [event.clientX, event.clientY]);
            setPosition({left: px + 'px', top: py + 'px', side});
            triggerEvent(modalName, {isOpened: true});
        }
    }
    function onScroll() {
        triggerEvent(modalName, {isOpened: false});
    }
    function onMouseDown(event) {
        if (event.ctrlKey)
            triggerEvent('action:init', event);
    }
    useAddEvent("mousedown", onMouseDown);
    useAddEvent("contextmenu", contextMenu);
    useAddEvent("scroll", onScroll, {passive: true});

    return (
        <ModalManager name={name} key={name}>
            <TransformItem config={{position:'fixed', width:'auto', ...position}}
                           style={{bg:'bg-none'}} data-type={'modal'}>
                <ContextMenu actions={actions} side={position.side}></ContextMenu>
            </TransformItem>
        </ModalManager>
    );
};

export default ContextMenuContainer;