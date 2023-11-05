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
        if (action[0] === '$') {
            triggerEvent("action:function", {name: 'add', args:'order'});
        } else {
            window.open(action, "_blank")
        }
    }
    return (
        <div className={"item__price"}>
            <InfoParagraph type={'price'}>{`Цена: ${data.price}₽`}</InfoParagraph>
            <ItemLink data={data}></ItemLink>
            <ActionButton onClick={buttonCallback} authorizeAction={true}>
                {data.button || 'купить'}
            </ActionButton>
        </div>
    );
};

export default ItemPrice;