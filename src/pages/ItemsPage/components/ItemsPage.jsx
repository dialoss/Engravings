import React from 'react';
import PageComments from "components/PageComments/PageComments";
import ItemListContainer from "../../../modules/ItemList/components/ItemListContainer";

const ItemsPage = ({addComments}) => {
    return (
        <>
            <ItemListContainer/>
            <div style={{flexGrow: 1, minHeight:1}}></div>
            {addComments && <PageComments/>}
        </>
    );
};

export default ItemsPage;