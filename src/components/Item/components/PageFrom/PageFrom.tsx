import React from 'react';
import {Link} from "react-router-dom";
import "./PageFrom.scss";

const PageFrom = ({data}) => {
    return (
        <>
            {!!data.page_from &&
                <div className={"item__page-from"}>
                    <Link to={'/' + data.page_from.path}></Link>
                </div>
            }
        </>
    );
};

export default PageFrom;