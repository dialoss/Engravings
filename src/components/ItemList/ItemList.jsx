import React, {useContext, useState} from 'react';
import Item from "components/Item/Item";
import MyMasonry from "ui/Masonry/MyMasonry";
import Container from "ui/Container/Container";
import {ActiveThemes} from "ui/Themes/index";
import NavButton from "../../ui/Navbar/Button/NavButton";
import "./ItemList.scss";

const ItemList = ({items, className}) => {
    const style = useContext(ActiveThemes).listStyle;
    let columns = style && +style.masonry;
    let points = style && JSON.parse(style.widthPoints);
    const [forceColumns, setColumns] = useState(0);
    const ref = React.useRef();
    function calcForceColumns() {
        const curColumns = +ref.current.getAttribute('data-columns');
        const mCols = 4;
        setColumns(Math.max(1, ((mCols + (curColumns + 1)) % mCols)));
    }
    return (
        <div className={"item-list " + className}>
            <NavButton className={"itemlist"} data={{text: '', callback: calcForceColumns}}></NavButton>
            <Container style={{marginBottom: "50px"}}>
                {!!style && <MyMasonry
                    maxColumns={columns}
                    widthPoints={points}
                    forceColumns={forceColumns}
                    ref={ref}
                >
                    {
                        items.map((item) => <Item item={item} key={item.id}></Item>
                        )
                    }
                </MyMasonry>}
            </Container>
        </div>
    );
};

export default ItemList;