//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {All, DescriptionPage, Main} from "../components/ItemList/ItemList";
import Print from "../components/Item/components/Print/Print";

export const ROUTES = [
    {
        text: 'главная',
        path: '/main/',
        element: Main,
        hide:true,
    },
    {
        text: 'о художнике',
        path: '/main/#about',
        element: Main,
        hide:true,
    },
    {
        text: 'все гравюры',
        path: '/all/',
        element: All,
        hide: false,
    },
    {
        path: '/description/:id',
        element: DescriptionPage,
        hide: false,
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