import React from 'react';
import "./Auth.scss";
import AuthButton from "./AuthButton";
import {useGoogleLogin} from "@react-oauth/google";
import {sendLocalRequest, sendRequest} from "../../../api/requests";
import {useDispatch} from "react-redux";
import {actions} from "../store/user/reducers";
import Credentials from "../api/googleapi";
import {useLocation} from "react-router-dom";
import {getLocation} from "../../../hooks/getLocation";
import {getAuth} from "firebase/auth";

const r = (url, data={}, method="GET") => fetch(url, {
    method,
    ...(method !== 'GET' ? {body: JSON.stringify(data)} : {}),
}).then(res => res.json()).then(data => data);

const Auth = ({user, logout, children}) => {
    const dispatch = useDispatch();
    const setUser = (v) => dispatch(actions.setUser(v));
    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            // r('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + tokenResponse.access_token).then(userInfo =>
            //     r('http://127.0.0.1:8080/auth', {email: userInfo.email}, 'POST').then(data => {
            //         r('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key='
            //             + process.env.REACT_APP_FIREBASE_API, {
            //             token: data.token,
            //             returnSecureToken: true
            //         }, 'POST').then(d => {
            //             console.log(d)
            //             let user = {
            //                 firebase: {
            //                     token: data.token,
            //                 },
            //                 user: {
            //                     ...userInfo
            //                 }
            //             }
            //             setUser({...user, authenticated: true})
            //         })
            //     })
            // );
            console.log(tokenResponse)
            sendLocalRequest('/api/user/login/', {token: tokenResponse.access_token}, 'POST').then(data => {
                if (data.auth) {
                    setUser({...data.user, authenticated: true});
                }
            });
        },
    });
    return (
        <div className={"auth"}>
            <div className={"user-profile " + ((getLocation().relativeURL === '/customer/') ? 'active' : '')}>
                {!user.authenticated &&
                    <AuthButton type={'signin'} callback={login} onClick={() => login()}>
                        Вход
                    </AuthButton>
                }
                {user.authenticated && <>
                    {children}
                    <img src={user.picture} alt=""/>
                    <h3>{user.name}</h3>
                    <AuthButton type={'signout'} callback={logout}>Выйти</AuthButton>
                </>}
            </div>
        </div>
    );
};

export default Auth;