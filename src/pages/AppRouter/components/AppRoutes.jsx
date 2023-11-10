import React, {useEffect, useLayoutEffect} from 'react';
import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom";
import {routes} from "../constants/routes";
import {Intro} from "pages/MainPage";
import {getLocation} from "hooks/getLocation";
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "../../../hooks/useAddEvent";
import ItemsPage from "../../ItemsPage/components/ItemsPage";
import {useSelector} from "react-redux";

const Components = {
    'ItemsPage': ItemsPage,
    'Main': Intro,
};

const PageWrapper = ({route}) => {
    const location = getLocation();
    document.title = "MyMount | " + location.pageTitle;
    window.pageComments = route.comments;
    if (window.location.hash) {
        // console.log(window.location)
        // window.history.replaceState("", document.title, window.location.origin + location.relativeURL);
    }
    useEffect(()=>{
        if (location.pageSlug === 'main') document.querySelector('.container-main').style.minHeight = 'auto'
        else document.querySelector('.container-main').style.minHeight = '100dvh'
    },[])

    return (
        <>
            {React.createElement(Components[route.component], {key: location.relativeURL})}
        </>
    );
};

const AppRoutes = () => {
    const navigate = useNavigate();

    function handleNavigate(event) {
        navigate(event.detail.path);
    }

    useAddEvent("router:navigate", handleNavigate)

    useLayoutEffect(() => {
        // const anchor = window.location.hash.slice(1);
        // if (anchor) {
        //     const newLoc = window.location;
        //     newLoc.replace('#' + anchor, '');
        //     window.location = newLoc;
        //     window.anchor = anchor;
        // }
        // if (window.anchor) {
        //     const anchorEl = document.getElementById(window.anchor);
        //     if (anchorEl) {
        //         anchorEl.scrollIntoView();
        //     }
        //     window.anchor = null;
        // }
    }, []);

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
            <Route path={'*'} element={<Navigate to={'/main/'}/>}/>
        </Routes>
    );
};

export default AppRoutes;