import React from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../../helpers/events";
import "./ItemPrice.scss";
import ItemLink from "../Link/ItemLink";

const ItemPrice = ({data}) => {
    return (
        <div className={"item__price"}>
            <InfoParagraph type={'price'}>{`Цена: ${data.price}₽`}</InfoParagraph>
            <ItemLink data={data}></ItemLink>
            <ActionButton onClick={() => window.open(data.link, "_blank")}>
                {data.text || 'Купить'}
            </ActionButton>
        </div>
    );
};

export default ItemPrice;