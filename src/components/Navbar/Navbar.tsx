//@ts-nocheck
import React from 'react';
import './Navbar.scss';
import NavButton from "../../ui/Buttons/NavButton/NavButton";

const Navbar = ({routes, ...props}) => {
    return (
        <div className={"navbar"} {...props}>
            {routes.map((navData, index) => {
                return <NavButton style={navData.style} data={navData} key={index}/>
            })}
        </div>
    );
};

export default Navbar;