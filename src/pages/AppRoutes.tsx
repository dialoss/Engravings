//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {All, Main} from "../components/ItemList/ItemList";

export const ROUTES = [
    {
        text: 'главная',
        path: '/main/',
        element: Main,
    },
    {
        text: 'о художнике',
        path: '/main/#about',
        element: Main,
    },
    {
        text: 'все гравюры',
        path: '/all/',
        element: All,
    },
]

const AppRoutes = () => {
    return (
        <Routes>
            {
                ROUTES.map(r => <Route path={r.path} element={React.createElement(r.element)} key={r.path}></Route>)
            }
            <Route path={'*'} element={<Navigate to={'/main/'}/>}/>
        </Routes>
    );
};

export default AppRoutes;