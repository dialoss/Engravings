import React, {useCallback} from 'react';
import "./BaseItem.scss";
import PageFrom from "../PageFrom/PageFrom";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";
import {SimpleItem} from "../../Item";

const ItemBase = ({data}) => {
    const extra = useCallback(() =>
        data.items.map(it => it.type === 'price' && <SimpleItem item={it} key={it.id} depth={2}></SimpleItem>), [data]);
    return (
        <div className={"item__base"}>
            <PageFrom data={data}></PageFrom>
            <InfoBlock className={"item__info"} data={data} extra={extra()}></InfoBlock>
        </div>
    );
};

export default ItemBase;