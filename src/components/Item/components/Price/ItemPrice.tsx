//@ts-nocheck
import React from 'react';
import InfoParagraph from "../../../../ui/InfoParagraph/InfoParagraph";
import "./ItemPrice.scss";
import ButtonItem from "../Button/ButtonItem";

const ItemPrice = ({data}) => {
    return (
        <div className={"item__price"}>
            <div className="price">
                Цена: <InfoParagraph type={'price'} id={data.id}>{data.price}</InfoParagraph>₽
            </div>
            <ButtonItem data={data}></ButtonItem>
        </div>
    );
};

export default ItemPrice;