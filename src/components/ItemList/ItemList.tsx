//@ts-nocheck
import React from 'react';
import Item from "components/Item/Item";
import "./ItemList.scss";
import "./Themes/main.scss";
import {getLocation} from "../../hooks/getLocation";
import {useAppSelector} from "hooks/redux";

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