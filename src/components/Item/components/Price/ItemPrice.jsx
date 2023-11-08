import React from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ItemPrice.scss";
import ItemLink from "../Link/ItemLink";

const ItemPrice = ({data}) => {
    function buttonCallback() {
        let action = data.link;
        if (!action) return;
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
    return (
        <div className={"item__price"}>
            <div className="price">
                Цена: <InfoParagraph type={'price'}>{data.price}</InfoParagraph>₽
            </div>
            <ItemLink data={data}></ItemLink>
            <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.button}
            </ActionButton>
        </div>
    );
};

export default ItemPrice;