import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import NavButton from "../../ui/Buttons/NavButton/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import {useSelector} from "react-redux";

const ItemList = ({items, className, loadMore=null}) => {
    const edit = useSelector(state => state.elements.editPage);
    return (
        <div className={`item-list ${className} ${getLocation().pageSlug} ${edit ? 'edit' : ''}`}>
            {
                items.map((item) => <Item item={item} key={item.id}></Item>)
            }
            {!!items.length && loadMore && <NavButton className={"load-more"} data={{text: 'Показать больше', callback:loadMore}}></NavButton>}
        </div>
    );
};

export default ItemList;