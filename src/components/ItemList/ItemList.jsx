import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import MyMasonry from "ui/Masonry/MyMasonry";
import Container from "ui/Container/Container";
import NavButton from "../../ui/Buttons/NavButton/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import {useAddEvent} from "../../hooks/useAddEvent";
import {useSelector} from "react-redux";

const ItemList = ({items, className, loadMore=null}) => {
    const [forceColumns, setColumns] = useState(0);
    const ref = React.useRef();
    function calcForceColumns() {
        const curColumns = +ref.current.getAttribute('data-columns');
        const mCols = 4;
        const newCols = Math.max(1, ((mCols + (curColumns + 1)) % mCols));
        setColumns(newCols);
    }

    useAddEvent('itemlist:view', calcForceColumns);

    let style = 'parent';
    if (getLocation().parentSlug) style = 'child';
    const edit = useSelector(state => state.elements.editPage);
    return (
        <div className={`item-list ${className} ${style} ${getLocation().pageSlug} ${edit ? 'edit' : ''}`}>
            <MyMasonry
                maxColumns={1}
                forceColumns={forceColumns}
                ref={ref}
            >
                {
                    items.map((item) => <Item item={item} key={item.id}></Item>)
                }
            </MyMasonry>
            {!!items.length && loadMore && <NavButton className={"load-more"} data={{text: 'Показать больше', callback:loadMore}}></NavButton>}
        </div>
    );
};

export default ItemList;