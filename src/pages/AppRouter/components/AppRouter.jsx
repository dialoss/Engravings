import React, {useLayoutEffect} from 'react';
import AppRoutes from "./AppRoutes";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {actions} from "pages/AppRouter/store/reducers";
import {Navigation} from "modules/Navigation";

const AppRouter = () => {
    const location = useNavigate();
    const dispatch = useDispatch();
    dispatch(actions.setLocation());
    useLayoutEffect(() => {
        dispatch(actions.setLocation());
    }, [location]);

    return (
        <>
            <Navigation/>
            <AppRoutes/>
        </>
    );
};

export default AppRouter;