import React from 'react';
import "./BaseItem.scss";
import PageFrom from "../PageFrom/PageFrom";
import ItemPrice from "../Price/ItemPrice";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";

const ItemBase = ({data}) => {
    return (
        <div className={"item__base"}>
            <PageFrom data={data}></PageFrom>
            <InfoBlock className={"item__info"} data={data} extra={
                data.items.map(it => it.type === 'price' && <ItemPrice data={it} key={it.id}></ItemPrice>)
            }></InfoBlock>
        </div>
    );
};

export default ItemBase;