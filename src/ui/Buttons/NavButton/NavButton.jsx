import React from 'react';
import './NavButton.scss';
import {Link} from "react-router-dom";

const NavButton = ({data, style, className}) => {
    return (
        <div className={"nav__button " + className + ' nav__button--' + style}>
            {!!data.callback ?
                <a onClick={data.callback}>{data.text}</a> :
                <Link to={`${data.path}`}>{data.text}</Link>
            }
        </div>
    );
};

export default NavButton;