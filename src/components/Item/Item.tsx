//@ts-nocheck
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Item.scss';
import ItemData from "./components/ItemData";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {useAppSelector} from "hooks/redux";
import {isMobileDevice} from "../../helpers/events";
import {initContainerDimensions} from "../../ui/ObjectTransform/helpers";
import MyMasonry from "../../ui/Masonry/MyMasonry";
import {ItemElement} from "../../ui/ObjectTransform/ObjectTransform";
import {format} from "../ItemList/CSSEditor/CSSEditor";

interface ItemProps {
    item: ItemElement;
    depth: number;
}

export const SimpleItem = ({item, depth=0}: ItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        for (let it of item.items) {
            if (isMobileDevice() && !item.type.match(/model|image|video|textfield/)) {
                // it.style.position = 'initial';
                // it.style.width = 'auto';
            }
        }
        setTimeout(()=>{
            initContainerDimensions(ref.current.parentElement);
        },0)
    }, [item]);

    const itemData = <ItemData data={{...item.data, type: item.type, id: item.id}}></ItemData>;

    const masonry = item.data.modifiers ? <MyMasonry maxColumns={+item.data.modifiers.split("_")[1]}>{
        item.items.map(item => <Item depth={depth + 1} item={item} key={item.id}></Item>)
    }</MyMasonry> : item.items.map(item => <Item depth={depth + 1} item={item} key={item.id}></Item>);

    return (
        <div className={`item item-${item.type}`} ref={ref} data-depth={depth}
             onDragStart={e => e.preventDefault()}>
            {['timeline_entry'].includes(item.type) && itemData}
                {!['timeline', 'timeline_entry'].includes(item.type)
                    && <div className={'items-wrapper'}>
                        {masonry}
                </div>}
                {!['base', 'timeline_entry'].includes(item.type) && itemData}
            {['base'].includes(item.type) && itemData}
        </div>
    );
}

const Item = ({item, depth=0} : ItemProps) => {
    return (
        <TransformItem key={item.id}
                       style={JSON.parse(item.style || "{}")}
                       type={item.type}
                       depth={depth}
                       id={item.id}
                       className={'transform-origin'}>
            <SimpleItem item={item} depth={depth}></SimpleItem>
        </TransformItem>
    );
};

export default Item;