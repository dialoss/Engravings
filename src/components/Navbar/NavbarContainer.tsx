import React from 'react';
import {NavbarRoutes} from "./routes";
import {useAppSelector} from "hooks/redux";
import Navbar from "./Navbar";

const NavbarContainer = () => {
    const location = useAppSelector(state=> state.location);
    function isActive(path) {
        return location.relativeURL.split('/')[1] === path && location.parentSlug;
    }
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