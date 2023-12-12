//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import NavButton from "../../ui/Buttons/NavButton/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import {useAppSelector} from "hooks/redux";
import Hierarchy from "../../ui/Hierarchy/Hierarchy";

const ItemList = ({items, className, loadMore=null}) => {
    const edit = useAppSelector(state => state.elements.editPage);
    return (
        <div className={`item-list ${className} ${getLocation().pageSlug} ${edit ? 'edit' : ''}`}>
            {/*<Hierarchy data={items} config={{*/}
            {/*    childSelector: "items",*/}
            {/*    parentSelector: "parent",*/}
            {/*    componentDataProp: "item",*/}
            {/*    recursiveComponent: Item,*/}
            {/*    accordion: false,*/}
            {/*}}></Hierarchy>*/}
            {
                items.map(it=><Item item={it} depth={0}></Item>)
            }
            {/*{loadMore && <NavButton className={"load-more"} data={{text: 'Показать больше', callback:loadMore}}></NavButton>}*/}
        </div>
    );
};

export default ItemList;