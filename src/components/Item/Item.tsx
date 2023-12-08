import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Item.scss';
import ItemData from "./components/ItemData";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import TransformContainer from "../../ui/ObjectTransform/components/TransformContainer/TransformContainer";
import {useSelector} from "react-redux";
import {isMobileDevice} from "../../helpers/events";
import {initContainerDimensions} from "../../ui/ObjectTransform/helpers";
import MyMasonry from "../../ui/Masonry/MyMasonry";

export const SimpleItem = ({item, depth=0}) => {
    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        item.items && item.items.sort((a, b) => a.order - b.order);
    }, []);
    useEffect(() => {
        const itemRef = ref.current;
        const itemTransform = itemRef.closest(".transform-item");

        itemTransform.style.width = item.width;
        let mediaItems = 0;
        let itemsRow = 1;
        for (const it of item.items) {
            if (['video', 'image', 'model'].includes(it.type) && it.position !== 'absolute') mediaItems += 1;
        }
        if (mediaItems >= 3 && !isMobileDevice()) itemsRow = 3;
        else if (mediaItems >= 2) itemsRow = 2;
        const wrapper = itemTransform.querySelector('.items-wrapper');
        for (let it of item.items) {
            let transform = wrapper && wrapper.querySelector(`.item[data-id="${it.id}"]`);
            if (!transform) continue;
            transform = transform.closest('.transform-item');
            if (isMobileDevice()) {
                if (!['model', 'image','video', 'textfield'].includes(item.type)) {
                    it.position = 'initial';
                    it.width = 'auto';
                }
            }
            if (it.position !== 'absolute' && it.width === 'auto') {
                if (['video', 'image', 'model'].includes(it.type)) {
                    // transform.style.width = 100 / itemsRow + '%';
                }
                it.width = transform.style.width;
            }
        }
        // initContainerDimensions({itemTransform, resize:true});
    }, [item]);

    function getStyle() {
        return {}
    }

    return (
        <div className={`item item-${item.type}`}
             data-id={item.id} ref={ref} data-depth={depth} style={getStyle()}
             onDragStart={e => e.preventDefault()}>
            {['timeline_entry'].includes(item.type) && <ItemData data={item}></ItemData>}
                {!['timeline', 'timeline_entry'].includes(item.type)
                    && <div className={'items-wrapper'}>
                        {item.items.map(item => <Item depth={depth + 1} item={item} key={item.id}></Item>)}
                </div>}
                {!['base', 'timeline_entry'].includes(item.type) && <ItemData data={item}></ItemData>}
            {['base'].includes(item.type) && <ItemData data={item}></ItemData>}
        </div>
    );
}

const Item = ({item, depth=0}) => {
    const admin = useSelector(state => state.users.current.isAdmin);
    return (
        <TransformItem key={item.id + item.items.length}
                       config={item}
                       data-style={item.style}
                       data-type={item.type}
                       data-depth={depth}
                       className={(admin ? 'edit' : '')}
                       secure={true}>
            <SimpleItem item={item} depth={depth}></SimpleItem>
        </TransformItem>
    );
};

export default Item;