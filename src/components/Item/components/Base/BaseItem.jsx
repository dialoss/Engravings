import React, {useCallback} from 'react';
import "./BaseItem.scss";
import PageFrom from "../PageFrom/PageFrom";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";
import {SimpleItem} from "../../Item";

const ItemBase = ({data}) => {
    return (
        <div className={"item__base"}>
            <PageFrom data={data}></PageFrom>
            <InfoBlock className={"item__info"} data={data}></InfoBlock>
        </div>
    );
};

export default ItemBase;