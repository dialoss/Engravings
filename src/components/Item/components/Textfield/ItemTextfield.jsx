import React from 'react';
import InfoParagraph from "ui/InfoParagraph/InfoParagraph";
import "./ItemTextfield.scss";

const ItemTextfield = ({data}) => {
    return (
        <div className={"item__textfield"}>
            <InfoParagraph type={"textfield"}>{data.text}</InfoParagraph>
        </div>
    );
};

export default ItemTextfield;