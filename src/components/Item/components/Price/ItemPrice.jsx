import React from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ItemPrice.scss";
import ItemLink from "../Link/ItemLink";
import ButtonItem from "../Button/ButtonItem";

const ItemPrice = ({data}) => {
    return (
        <div className={"item__price"}>
            <div className="price">
                Цена: <InfoParagraph type={'price'}>{data.price}</InfoParagraph>₽
            </div>
            <ButtonItem data={data}></ButtonItem>
        </div>
    );
};

export default ItemPrice;