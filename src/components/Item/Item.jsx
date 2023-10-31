import React, {useContext, useEffect, useRef, useState} from 'react';
import './Item.scss';
import ItemData from "./components/ItemData";
import {ActiveThemes} from "ui/Themes";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import TransformContainer from "../../ui/ObjectTransform/components/TransformContainer/TransformContainer";

const Item = ({item, depth=0}) => {

    let mediaItems = 0;
    let itemsRow = 1;
    item.items.forEach(item => {
        if (['video', 'image', 'model'].includes(item.type)) mediaItems += 1;
    })
    if (mediaItems >= 3) itemsRow = 3;
    else if (mediaItems >= 2) itemsRow = 2;

    const ref = useRef();
    const [itemProps, setItemProps] = useState({style: {}});
    useEffect(() => {
        const itemRef = ref.current;
        const itemTransform = itemRef.closest(".transform-item");
        const container = itemRef.closest(".transform-container");
        let style = {};
        if (['video', 'image', 'model'].includes(item.type)) {
            const contWidth = container.getBoundingClientRect().width;
            style['aspectRatio'] = item.media_width / item.media_height || '';

            if (itemTransform.style.position !== "absolute" && itemTransform.style.width === 'auto') {
                if (itemsRow > 1) {
                    itemTransform.style.width = 100 / itemsRow + "%";
                } else {
                    if (itemRef.getBoundingClientRect().width === 0 || !!itemTransform.style.width) {
                        itemTransform.style.width = Math.min(contWidth, item.media_width || contWidth) / contWidth * 100 + "%";
                    }
                }
            }
        }
        setItemProps({style, itemTransform, container});
    }, []);
    const theme = useContext(ActiveThemes);
    const style = (name) => Object.values(theme).map(th => th[name]).join(' ');
    return (
        <TransformItem key={item.id} config={item}>
            <div className={style('wrapper-' + item.type) + ' ' + style('wrapper-inner')}>
                <div className={`item item-${item.type} depth-${depth} transform-origin ${style('item-' + item.type)}`}
                     data-id={item.id} ref={ref} style={{...(!item.show_shadow && {boxShadow: "none"})}} data-depth={depth}
                     onDragStart={e => e.preventDefault()}>

                    <TransformContainer width={item.container_width} height={item.type !== 'base' ? 'fixed' : ''}>
                        {item.type !== 'timeline' && <div className={'items-wrapper items-wrapper--' + itemsRow}>
                            {
                                item.items && item.items.map(item =>
                                    <Item depth={depth + 1} item={item} key={item.id}></Item>)
                            }
                        </div>}
                        {item.type !== 'base' && <ItemData data={item} props={itemProps}></ItemData>}
                    </TransformContainer>
                    {item.type === 'base' && <ItemData data={item} props={itemProps}></ItemData>}
                </div>
            </div>
        </TransformItem>
    );
};

export default Item;