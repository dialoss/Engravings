import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Auth from "./components/Auth";
import {sendLocalRequest} from "../../api/requests";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "./store/user/reducers";
import {GoogleOAuthProvider} from '@react-oauth/google';
import Credentials from "./api/googleapi";

const CLEINT_ID = '1024510478167-dufqr18l2g3nmt7gkr5rakc9sjk5nf54.apps.googleusercontent.com';

const AuthContainer = ({children}) => {
    const user = useSelector(state => state.users.current);

    const dispatch = useDispatch();
    const setUser = (v) => dispatch(actions.setUser(v));

    function logout() {
        setUser({authenticated: false});
        sendLocalRequest('/api/user/logout/');
    }

    useLayoutEffect(() => {
        sendLocalRequest('/api/user/auth/').then(data => {
            if (data.auth) {
                setUser({...data.user, authenticated: true});
            }
        });
    }, []);

    return (
        <GoogleOAuthProvider clientId={CLEINT_ID}>
            <Auth user={user} logout={logout}>{children}</Auth>
        </GoogleOAuthProvider>
    );
};

export default AuthContainer;