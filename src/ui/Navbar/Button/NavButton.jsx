import React from 'react';
import './NavButton.scss';
import {Link} from "react-router-dom";

const NavButton = ({data, active, className}) => {
    return (
        <div className={"nav__button " + className + ' ' + (active ? "nav__button--current" : "")}>
            {!!data.callback ?
                <a onClick={data.callback}>{data.text}</a> :
                <Link to={`${data.path}`}>{data.text}</Link>
            }
        </div>
    );
};

export default NavButton;