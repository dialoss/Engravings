import React from 'react';
import Navbar from "ui/Navbar/Navbar";
import {NavbarRoutes} from "./routes";
import {getLocation} from "hooks/getLocation";
import {useSelector} from "react-redux";

const NavbarContainer = () => {
    const location = useSelector(state=> state.location);
    function isActive(path) {
        return location.relativeURL.split('/')[1] === path && location.parentSlug;
    }
    console.log(location)
    return (
        <Navbar routes={[...NavbarRoutes.map(route => ({
            ...route,
            style: isActive(route.path.split('/')[1]) ? 'current' : ''})
        ),{
            path: location.relativeURL,
            text: location.currentPage.title,
            style: 'current extra',
        }]}/>
    );
};

export default NavbarContainer;