import React from 'react';
import Navbar from "ui/Navbar/Navbar";
import {NavbarRoutes} from "./routes";
import {getLocation} from "hooks/getLocation";

const NavbarContainer = () => {
    const location = getLocation();
    function isActive(path) {
        return location.relativeURL.split('/')[1] === path;
    }
    console.log(location)
    return (
        <Navbar routes={NavbarRoutes.map(route => ({
            ...route,
            style: isActive(route.path.split('/')[1]) ? 'current' : ''})
        ).concat([{
            path: location.relativeURL,
            text: location.pageSlug.toUpperCase(),
            style: location.parentSlug ? 'current extra' : ' extra',
        }])}/>
    );
};

export default NavbarContainer;