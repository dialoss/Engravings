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
    const ref = useRef();
    useLayoutEffect(() => {
        item.items && item.items.sort((a, b) => a.order - b.order);
    }, []);
    useEffect(() => {
        const itemRef = ref.current;
        const itemTransform = itemRef.closest(".transform-item");
        const container = itemTransform.querySelector('.transform-container');
        itemTransform.style.width = item.width;
        let mediaItems = 0;
        let itemsRow = 1;
        for (const it of item.items) {
            if (['video', 'image', 'model'].includes(it.type) && it.position !== 'absolute') mediaItems += 1;
        }
        if (mediaItems >= 3 && !isMobileDevice()) itemsRow = 3;
        else if (mediaItems >= 2) itemsRow = 2;
        const wrapper = container.querySelector('.items-wrapper');
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
        initContainerDimensions({container, resize:true});
    }, [item]);

    const masonry = item.style.match(/masonry/);
    let items = item.items.map(item => <Item depth={depth + 1} item={item} key={item.id}></Item>);
    if (masonry) {
        items = <MyMasonry maxColumns={+item.style.split("_")[1]}>
            {items}
        </MyMasonry>
    }
    let padding = '';
    if (item.style.match(/padding/)) padding = '0';

    return (
        <div className={'wrapper-' + item.type + ' wrapper-inner'} style={{padding}}>
            <div className={`item depth-${depth} item-${item.type}`} data-itemtype={'content'}
                 data-id={item.id} ref={ref} style={{...(!item.show_shadow && {boxShadow: "none"}),
                backgroundColor:item.bg_color}} data-depth={depth}
                 onDragStart={e => e.preventDefault()}>
                {['timeline_entry'].includes(item.type) && <ItemData data={item}></ItemData>}
                <TransformContainer data-width={item.container_width}
                                    data-type={item.type}
                                    data-height={item.height === 'auto' ? 'fixed' : item.height}>
                    {!['timeline', 'timeline_entry'].includes(item.type)
                        && <div className={'items-wrapper'}>
                            {items}
                        </div>}
                    {!['base', 'timeline_entry'].includes(item.type) && <ItemData data={item}></ItemData>}
                </TransformContainer>
                {['base'].includes(item.type) && <ItemData data={item}></ItemData>}
            </div>
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