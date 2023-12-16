//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import AppRoutes from "./AppRoutes";
import {useNavigate} from "react-router-dom";
import {actions} from "pages/AppRouter/store/reducers";
import {sendLocalRequest} from "../../../api/requests";
import {useAppDispatch} from "../../../hooks/redux";
import {getLocation} from "../../../hooks/getLocation";
import store from "../../../store";

async function fetchPages() {
    const response = await sendLocalRequest('/api/pages/');
    if (!response) return;
    store.dispatch(actions.setPages(response));
    store.dispatch(actions.setLocation());
}

const AppRouter = () => {
    const location = useNavigate();
    const dispatch = useAppDispatch();
    dispatch(actions.setLocation());
    fetchPages();
    useLayoutEffect(() => {
        dispatch(actions.setLocation());
        sendLocalRequest('/api/pages/' + getLocation().pageSlug).then(r => {
            !r && window.callbacks.call("router:navigate", '/main/');
        });
    }, [location]);

    return (
        <AppRoutes/>
    );
};

export default AppRouter;