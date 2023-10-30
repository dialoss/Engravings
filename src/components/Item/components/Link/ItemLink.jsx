import React from 'react';
import {Link} from "react-router-dom";
import "./ItemLink.scss";

const ItemLink = ({data}) => {
    return (
        <div className={"item__link"}>
            {
                !!data.page_from &&
                <Link to={'/' + data.page_from.path}></Link>
            }
        </div>
    );
};

export default ItemLink;