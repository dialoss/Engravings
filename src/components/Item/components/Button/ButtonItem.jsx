import React, {useRef} from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ButtonItem.scss";
import {preventOnTransformClick} from "../../../../ui/ObjectTransform/helpers";
import NavButton from "../../../../ui/Buttons/NavButton/NavButton";

const ButtonItem = ({data}) => {
    const ref = useRef();
    function buttonCallback() {
        if (preventOnTransformClick(ref)) return;
        let action = data.link;
        if (!action) return;
        if (action.includes('tab')) {
            const t = +(action.split('_')[1]);
            triggerEvent("itemlist:tab", t);
            return;
        }
        switch (action) {
            case "$buy":
                window.ym(95613565,'reachGoal','buy');
                triggerEvent("action:function", {name: 'add', args: 'buy'});
                return;
            case "$order":
                window.ym(95613565,'reachGoal','order');
                triggerEvent("action:function", {name: 'add', args:'order'});
                return;
        }
        if (action.match(/^\/.*/)) {
            triggerEvent("router:navigate", {path: action});
        } else {
            window.open(action, "_blank")
        }
    }
    const activeTab = data.link.includes('tab') && window.currentTab === +data.link.split('_')[1];
    return (
        <div className={"item__button"} ref={ref}>
            {data.style === 'action' && <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.text}
            </ActionButton>}
            {data.style === 'nav' && <NavButton data={{callback: buttonCallback, text:data.text}} style={activeTab ? 'current' : ''}>
            </NavButton>}
        </div>
    );
};

export default ButtonItem;