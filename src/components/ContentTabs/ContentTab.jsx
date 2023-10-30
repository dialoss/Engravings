import React from 'react';
import ItemList from "../ItemList/ItemList";

const ContentTab = ({content, id}) => {
    return (
        <div className={"content-tab"} data-id={id}>
            <ItemList items={content}></ItemList>
        </div>
    );
};

export default ContentTab;