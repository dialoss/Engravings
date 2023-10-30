import React from 'react';
import Navbar from "ui/Navbar/Navbar";
import {NavbarRoutes} from "./routes";
import {getLocation} from "hooks/getLocation";

const NavbarContainer = () => {
    const location = getLocation();
    function isActive(path) {
        return location.relativeURL.split('/')[1] === path;
    }
    return (
        <Navbar routes={NavbarRoutes.map(route => {
            return {
                ...route,
                active: isActive(route.path.split('/')[1]),
            }
        })}/>
    );
};

export default NavbarContainer;