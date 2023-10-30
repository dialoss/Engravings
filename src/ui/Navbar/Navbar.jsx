import React from 'react';
import NavButton from "./Button/NavButton";
import './Navbar.scss';

const Navbar = ({routes, ...props}) => {
    return (
        <div className={"navbar"} {...props}>
            {routes.map((navData, index) => {
                return <NavButton active={navData.active} data={navData} key={index}/>
            })}
        </div>
    );
};

export default Navbar;