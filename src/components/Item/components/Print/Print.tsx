//@ts-nocheck
import React from 'react';
import {ItemElement} from "../../../../ui/ObjectTransform/ObjectTransform";
import "./Print.scss";

const Print = ({data}) => {
    return (
        <div className={"item__print"}>
            <div className={"item__overlay"}></div>
            <iframe title="Луна Китаяма"
                    src={"https://view.genial.ly/" + data.url}
                    allowtransparency={"always"} allowFullScreen={true}></iframe>
        </div>
    );
};

export default Print;