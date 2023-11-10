import React from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ButtonItem.scss";
import {preventOnTransformClick} from "../../../../ui/ObjectTransform/helpers";

const ButtonItem = ({data}) => {
    function buttonCallback() {
        if (preventOnTransformClick()) return;
        let action = data.link;
        if (!action) return;
        switch (action) {
            case "$buy":
                triggerEvent("action:function", {name: 'add', args: 'buy'});
                break;
            case "$order":
                triggerEvent("action:function", {name: 'add', args:'order'});
                break;
            case "$view":
                triggerEvent("itemlist:view");
                break;
            default:
                window.open(action, "_blank")
        }
    }
    return (
        <div className={"item__button"}>
            <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.text}
            </ActionButton>
        </div>
    );
};

export default ButtonItem;