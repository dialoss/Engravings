import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {routes} from "../constants/routes";
import {Intro} from "pages/MainPage";
import {getLocation} from "hooks/getLocation";
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "../../../hooks/useAddEvent";
import ItemsPage from "../../ItemsPage/components/ItemsPage";

const Components = {
    'ItemsPage': ItemsPage,
    'Main': Intro,
};

const PageWrapper = ({route}) => {
    const location = getLocation();

    document.title = "MyMount | " + location.pageTitle;
    useAddEvent('keydown', e => {
        e.ctrlKey && e.altKey && e.key === 'e' && (window.editPage = !window.editPage);
        const itemList = document.querySelector('.item-list');
        if (window.editPage) itemList.classList.add('edit');
        else itemList.classList.remove('edit');
    })

    return (
        <>
            {React.createElement(Components[route.component], {addComments: route.comments, key: location.relativeURL})}
        </>
    );
};

const AppRoutes = () => {
    const navigate = useNavigate();

    function handleNavigate(event) {
        navigate(event.detail.path);
    }

    useAddEvent("router:navigate", handleNavigate)


    return (
        <Routes>
            {
                routes.map((route) =>
                    <Route element={<PageWrapper route={route} key={route.path}/>}
                           path={route.path}
                           exact={true}
                           key={route.path}/>
                )
            }
            <Route path={'/admin/'} element={<Navigate to={'/main/'}/>}/>
            <Route path={'*'} element={<Navigate to={'/main/'}/>}/>
        </Routes>
    );
};

export default AppRoutes;