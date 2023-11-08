import React from 'react';
import PageComments from "components/PageComments/PageComments";
import ItemListContainer from "../../../modules/ItemList/components/ItemListContainer";

const ItemsPage = ({addComments}) => {
    return (
        <>
            <ItemListContainer/>
            {addComments && <PageComments/>}
        </>
    );
};

export default ItemsPage;