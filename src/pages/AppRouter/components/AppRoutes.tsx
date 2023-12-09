import React, {useEffect, useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {routes} from "../constants/routes";
import {useAddEvent} from "../../../hooks/useAddEvent";
import ItemListContainer from "../../../modules/ItemList/components/ItemListContainer";
import store from "../../../store";
import {useAppSelector} from "hooks/redux";

const AppRoutes = () => {
    const navigate = useNavigate();

    function handleNavigate(event) {
        navigate(event.detail.path);
    }

    useAddEvent("router:navigate", handleNavigate)

    useLayoutEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const action = query.get('action');
        const id = query.get('id');
        switch (action) {
            case 'messenger':
                 window.messenger = id;
        }
    }, []);

    const location = useAppSelector(state => state.location);
    document.title = location.pageTitle + ' | MyMount';

    return (
        <Routes>
            {
                routes.map((route) =>
                    <Route element={<ItemListContainer key={location.relativeURL}></ItemListContainer>}
                           path={route.path}
                           exact={true}
                           key={route.path}/>
                )
            }
            <Route path={'*'} element={<Navigate to={'/main/'}/>}/>
        </Routes>
    );
};

export default AppRoutes;