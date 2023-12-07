import React from 'react';

const ItemLink = ({data}) => {
    return (
        <div className={"item__link"}>
            <a href={data.link}></a>
        </div>

    );
};

export default ItemLink;