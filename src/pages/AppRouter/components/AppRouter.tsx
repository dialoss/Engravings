//@ts-nocheck
import React, {useLayoutEffect} from 'react';
import AppRoutes from "./AppRoutes";
import {useNavigate} from "react-router-dom";
import {actions} from "pages/AppRouter/store/reducers";
import {sendLocalRequest} from "../../../api/requests";
import {triggerEvent} from "../../../helpers/events";
import store from "../../../store";
import {useAppDispatch} from "../../../hooks/redux";
import {getLocation} from "../../../hooks/getLocation";

const AppRouter = () => {
    const location = useNavigate();
    const dispatch = useAppDispatch();
    dispatch(actions.setLocation());
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