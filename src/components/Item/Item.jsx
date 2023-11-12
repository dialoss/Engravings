import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Item.scss';
import ItemData from "./components/ItemData";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import TransformContainer from "../../ui/ObjectTransform/components/TransformContainer/TransformContainer";
import {useSelector} from "react-redux";
import {CarouselInline} from "../Modals/Carousel/CarouselContainer";
import {isMobileDevice} from "../../helpers/events";
import {initContainerDimensions} from "../../ui/ObjectTransform/helpers";

export const SimpleItem = ({item, depth=0}) => {
    const ref = useRef();
    useEffect(() => {
        const itemRef = ref.current;
        const itemTransform = itemRef.closest(".transform-item");
        const container = itemTransform.querySelector('.transform-container');

        let mediaItems = 0;
        let itemsRow = 1;
        item.items.forEach(item => {
            if (['video', 'image', 'model'].includes(item.type) && item.position !== 'absolute') mediaItems += 1;
        })
        if (mediaItems >= 3 && !isMobileDevice()) itemsRow = 3;
        else if (mediaItems >= 2) itemsRow = 2;
        const items = container.querySelector('.items-wrapper');
        if (items) {
            for (const it of items.querySelectorAll(':scope > .transform-item')) {
                if (isMobileDevice() && it.getAttribute('data-type') === 'subscription') {
                    it.style.width = '100%';
                    it.style.position = 'initial';
                }
                if (it.style.position !== 'absolute' && it.style.width === 'auto') {
                    if (['video', 'image', 'model'].includes(it.querySelector('.transform-container').getAttribute('data-type'))) {
                        it.style.width = 100 / itemsRow + '%';
                    } else {
                        it.style.width = '0%';
                    }
                }
            }
        }
        initContainerDimensions({container, resize:true})
        setTimeout(()=>initContainerDimensions({container, resize:true}),0)
    }, []);

    return (
        <div className={'wrapper-' + item.type + ' wrapper-inner'}>
            <div className={`item depth-${depth} item-${item.type} transform-origin`}
                 data-id={item.id} ref={ref} style={{...(!item.show_shadow && {boxShadow: "none"})}} data-depth={depth}
                 onDragStart={e => e.preventDefault()}>
                {['timeline_entry'].includes(item.type) && <ItemData data={item}></ItemData>}
                <TransformContainer data-width={item.container_width}
                                    data-type={item.type}
                                    data-height={item.height === 'auto' ? 'fixed' : item.height}>
                    {!['timeline'].includes(item.type)
                        && <div className={'items-wrapper'}>
                            {item.items && item.items.map(item =>
                                <Item depth={depth + 1} item={item} key={item.id}></Item>)}
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
        <TransformItem key={item.id}
                       config={item}
                       data-group={item.group_order}
                       data-type={item.type}
                       className={(admin ? 'edit' : '')}
                       secure={true}>
            <SimpleItem item={item} depth={depth}></SimpleItem>
        </TransformItem>
    );
};

export default Item;