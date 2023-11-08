import React, {useEffect, useRef, useState} from 'react';
import Item from "components/Item/Item";
import MyMasonry from "ui/Masonry/MyMasonry";
import Container from "ui/Container/Container";
import NavButton from "../../ui/Navbar/Button/NavButton";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";

const ItemList = ({items, className}) => {
    const [config, setConfig] = useState({});
    const [forceColumns, setColumns] = useState(0);
    const ref = React.useRef();
    function calcForceColumns() {
        const curColumns = +ref.current.getAttribute('data-columns');
        const mCols = 4;
        setColumns(Math.max(1, ((mCols + (curColumns + 1)) % mCols)));
    }
    const listRef = useRef();
    useEffect(()=>{
        const style = window.getComputedStyle(listRef.current);
        setConfig({
            columns: +style.getPropertyValue('--masonry'),
            points: JSON.parse(style.getPropertyValue('--widthPoints')),
        })
    }, []);
    let style = 'parent';
    if (getLocation().parentSlug) style = 'child';
    const edit = window.editPage ? 'edit' : '';
    return (
        <div className={`item-list ${className} ${style} ${getLocation().pageSlug} ${edit}`} ref={listRef}>
            <NavButton className={"item-list__button"} data={{text: 'ВИД', callback: calcForceColumns}}></NavButton>
            <Container style={{marginBottom: "50px"}}>
                <MyMasonry
                    maxColumns={config.columns}
                    widthPoints={config.points}
                    forceColumns={forceColumns}
                    ref={ref}
                >
                    {
                        items.map((item) => <Item item={item} key={item.id}></Item>)
                    }
                </MyMasonry>
            </Container>
        </div>
    );
};

export default ItemList;