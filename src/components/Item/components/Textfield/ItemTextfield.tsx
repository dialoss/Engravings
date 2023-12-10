//@ts-nocheck
import React from 'react';
import InfoParagraph from "ui/InfoParagraph/InfoParagraph";
import "./ItemTextfield.scss";

const ItemTextfield = ({data}) => {
    return (
        <div className={"item__textfield"}>
            <InfoParagraph type={"textfield"} id={data.id}>{data.text}</InfoParagraph>
        </div>
    );
};

export default ItemTextfield;