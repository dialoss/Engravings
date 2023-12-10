//@ts-nocheck
import React, { useState} from 'react';
import ContextMenu from "./components/ContextMenu/ContextMenu";
import {getElementByType, getElementFromCursor, triggerEvent} from "helpers/events";
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import {getCorrectedPosition} from "../../../ui/helpers/viewport";
import TransformItem from "../../../ui/ObjectTransform/components/TransformItem/TransformItem";

const ContextMenuContainer = ({actions}) => {
    const name = "context";
    const windowName = name + '-window';
    const [position, setPosition] = useState({left: 0, top: 0});

    function selectItem(event) {
        if (getElementByType(event, "modal")) return;
        window.actions.elements.selectItems(getElementFromCursor(event, 'transform-item'), event);
    }

    function contextMenu(event) {
        if (event.detail > 1 || getElementFromCursor(event, 'quill')) return;
        event.preventDefault();
        selectItem(event);
        if (!event.ctrlKey) {
            const modal = document.querySelector('.modal__window.' + windowName + ' .transform-item');
            let [px, py, side] = getCorrectedPosition(modal, [event.clientX + 10, event.clientY + 10]);
            setPosition({left: px + 'px', top: py + 'px', side});
            window.modals.open(name);
        }
    }
    function onScroll() {
        window.modals.checkState(name) && window.modals.close(name, false);
    }
    useAddEvent("contextmenu", contextMenu);
    useAddEvent("scroll", onScroll);
    useAddEvent("mousedown", selectItem);

    return (
        <ModalManager name={name} key={name} style={{bg:'bg-none'}}>
            <TransformItem style={{position:'fixed', width:'auto', ...position}}
                           type={'modal'} className={name}>
                <ContextMenu actions={actions} side={position.side}></ContextMenu>
            </TransformItem>
        </ModalManager>
    );
};

export default ContextMenuContainer;