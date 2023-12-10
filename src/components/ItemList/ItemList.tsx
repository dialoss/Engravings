//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import NavButton from "../../ui/Buttons/NavButton/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import {useAppSelector} from "hooks/redux";

const ItemList = ({items, className, loadMore=null}) => {
    const edit = useAppSelector(state => state.elements.editPage);
    console.log(items)
    return (
        <div className={`item-list ${className} ${getLocation().pageSlug} ${edit ? 'edit' : ''}`}>
            {
                items.map((item) => <Item item={item} depth={0} key={item.id}></Item>)
            }
            {!!items.length && loadMore && <NavButton className={"load-more"} data={{text: 'Показать больше', callback:loadMore}}></NavButton>}
        </div>
    );
};

export default ItemList;