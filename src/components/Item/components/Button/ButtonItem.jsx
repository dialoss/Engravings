import React, {useRef} from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ButtonItem.scss";
import {preventOnTransformClick} from "../../../../ui/ObjectTransform/helpers";
import NavButton from "../../../../ui/Navbar/Button/NavButton";

const ButtonItem = ({data}) => {
    const ref = useRef();
    function buttonCallback() {
        if (preventOnTransformClick(ref)) return;
        let action = data.link;
        if (!action) return;
        if (action.includes('tab')) {
            const t = +(action.split('_')[1])
            triggerEvent("itemlist:tab", {tab: t});
            return;
        }
        switch (action) {
            case "$buy":
                triggerEvent("action:function", {name: 'add', args: 'buy'});
                break;
            case "$order":
                triggerEvent("action:function", {name: 'add', args:'order'});
                break;
            default:
                window.open(action, "_blank")
        }
    }
    const isTab = data.group_order.includes('tab');
    const activeTab = data.link.includes('tab') && window.currentTab === data.link.slice(1);
    return (
        <div className={"item__button"} ref={ref}>
            {!isTab && <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.text}
            </ActionButton>}
            {isTab && <NavButton data={{callback: buttonCallback, text:data.text}} style={activeTab ? 'current' : ''}>
            </NavButton>}
        </div>
    );
};

export default ButtonItem;