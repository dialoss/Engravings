//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {routes} from "../constants/routes";
import ItemListContainer from "../../../modules/ItemList/components/ItemListContainer";
import {useAppSelector} from "hooks/redux";

const AppRoutes = () => {
    const navigate = useNavigate();

    window.callbacks.register("router:navigate", navigate);

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
    document.title = location.currentPage.title.toUpperCase() + ' | MyMount';

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