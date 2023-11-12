import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import MyMasonry from "ui/Masonry/MyMasonry";
import Container from "ui/Container/Container";
import NavButton from "../../ui/Navbar/Button/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import PageComments from "../PageComments/PageComments";
import {fetchItems} from "../../modules/ItemList/api/fetchItems";
import {useAddEvent} from "../../hooks/useAddEvent";
import {triggerEvent} from "../../helpers/events";

const ItemList = ({items, className, loadMore=null}) => {
    const [config, setConfig] = useState({});
    const [forceColumns, setColumns] = useState(0);
    const ref = React.useRef();
    function calcForceColumns() {
        const curColumns = +ref.current.getAttribute('data-columns');
        const mCols = 4;
        const newCols = Math.max(1, ((mCols + (curColumns + 1)) % mCols));
        setColumns(newCols);
    }

    useAddEvent('itemlist:view', calcForceColumns);

    const listRef = useRef();
    useEffect(()=>{
        const style = window.getComputedStyle(listRef.current);
        setConfig({
            columns: +style.getPropertyValue('--masonry'),
        })
    }, []);

    let style = 'parent';
    if (getLocation().parentSlug) style = 'child';
    const edit = window.editPage ? 'edit' : '';
    console.log('FORCE',forceColumns)
    return (
        <div className={`item-list ${className} ${style} ${getLocation().pageSlug} ${edit}`} ref={listRef}>
            <NavButton data={{text: "ВИД", callback: () => triggerEvent('itemlist:view')}} className={'view'}></NavButton>
            <Container style={{marginBottom: "50px"}}>
                <MyMasonry
                    maxColumns={config.columns}
                    forceColumns={forceColumns}
                    ref={ref}
                >
                    {
                        items.map((item) => <Item item={item} key={item.id}></Item>)
                    }
                </MyMasonry>
                {!!items.length && loadMore && <NavButton className={"load-more"} data={{text: 'ЗАГРУЗИТЬ ЕЩЁ', callback:loadMore}}></NavButton>}
            </Container>
        </div>
    );
};

export default ItemList;