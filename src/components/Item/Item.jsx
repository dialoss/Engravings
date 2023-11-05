import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Item.scss';
import ItemData from "./components/ItemData";
import {ActiveThemes} from "ui/Themes";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import TransformContainer from "../../ui/ObjectTransform/components/TransformContainer/TransformContainer";
import {triggerEvent} from "../../helpers/events";
import {useSelector} from "react-redux";

const Item = ({item, depth=0}) => {
    const ref = useRef();
    const [itemProps, setItemProps] = useState({});
    useEffect(() => {
        const itemRef = ref.current;
        const itemTransform = itemRef.closest(".transform-item");
        const container = itemTransform.querySelector('.transform-container');

        let mediaItems = 0;
        let itemsRow = 1;
        item.items.forEach(item => {
            if (['video', 'image', 'model'].includes(item.type) && item.position !== 'absolute') mediaItems += 1;
        })
        if (mediaItems >= 3) itemsRow = 3;
        else if (mediaItems >= 2) itemsRow = 2;
        const items = container.querySelector('.items-wrapper');
        if (items) {
            for (const it of items.querySelectorAll(':scope > .transform-item')) {
                if (it.style.position !== 'absolute' && it.style.width === 'auto') {
                    if (['video', 'image', 'model'].includes(it.querySelector('.transform-container').getAttribute('data-type'))) {
                        it.style.width = 100 / itemsRow + '%';
                    } else {
                        it.style.width = '80%';
                    }
                }
            }
        }
        setTimeout(()=>{
            triggerEvent("container:init", {container, resize:true});
        }, 100)
    }, []);
    const theme = useContext(ActiveThemes);
    const style = (name) => Object.values(theme).map(th => th[name]).join(' ');
    const admin = useSelector(state => state.users.current.isAdmin);
    return (
        <TransformItem key={item.id} config={item} className={(admin ? 'edit' : '') + ' item-' + item.type}>
            <div className={style('wrapper-' + item.type) + ' ' + style('wrapper-inner')}>
                <div className={`item item-${item.type} depth-${depth} transform-origin ${style('item-' + item.type)}`}
                     data-id={item.id} ref={ref} style={{...(!item.show_shadow && {boxShadow: "none"})}} data-depth={depth}
                     onDragStart={e => e.preventDefault()}>

                    <TransformContainer data-width={item.container_width}
                                        data-type={item.type}
                                        data-height={item.height === 'auto' ? 'fixed' : item.height}>
                        {!['timeline'].includes(item.type)
                            && <div className={'items-wrapper'}>
                            {
                                item.items && item.items.map(item =>
                                    <Item depth={depth + 1} item={item} key={item.id}></Item>)
                            }
                        </div>}
                        {item.type !== 'base' && <ItemData data={item}></ItemData>}
                    </TransformContainer>
                    {item.type === 'base' && <ItemData data={item}></ItemData>}
                </div>
            </div>
        </TransformItem>
    );
};

export default Item;