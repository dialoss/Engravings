//@ts-nocheck
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google';
import store from "../../store";
import {actions} from "./store/user/reducers";
import {triggerEvent} from "../../helpers/events";
import {sendLocalRequest} from "../../api/requests";
import {useAddEvent} from "../../hooks/useAddEvent";
import AuthButton, {GoogleIcon} from "./components/AuthButton";
import ModalForm, {FormContainer} from "../ActionForm/FormContainer";
import {loginForm, registerForm} from "./forms/loginForm";
import ActionButton from "../../ui/Buttons/ActionButton/ActionButton";
import Spinner from "../../ui/Spinner/Spinner";
import {FormSerializer} from "../ActionForm/helpers/FormData";

const CLEINT_ID = '1024510478167-dufqr18l2g3nmt7gkr5rakc9sjk5nf54.apps.googleusercontent.com';

const userStore = (data) => store.dispatch(actions.setUser(data));

class LocalAuth {
    static type = '';
    static setUser(data) {
        if (data.auth) {
            userStore({...data.user, authenticated: true});
            triggerEvent("alert:trigger", {
                type: 'success',
                body: '',
            });
            return true;
        } else {
            data.error && triggerEvent("alert:trigger", {
                type: 'error',
                body: data.error,
            });
            return false;
        }
    }
    static login(data, callback) {
        sendLocalRequest('/api/user/login/', {...data, type: LocalAuth.type}, 'POST').then(data => {
            callback(LocalAuth.setUser(data));
        });
    }

    static auth() {
        sendLocalRequest('/api/user/auth/').then(data => {
            LocalAuth.setUser(data);
        });
    }

    static logout() {
        userStore({authenticated: false});
        sendLocalRequest('/api/user/logout/');
    }
}

const LoginForm = ({callback, visible}) => {
    const data = [registerForm, loginForm];
    const [stage, setStage] = useState(0);
    const buttons = data.map((d, i) =>
        <ActionButton onClick={()=>setStage(i)} key={i}>{d.title}</ActionButton>);
    return (
        <div style={visible ? {visibility:'visible',opacity:1} : {visibility:"hidden",opacity:0}}>
            {
                data.map((d, i) =>
                    <div className={'form-wrapper'} style={{display: stage===i?'block':'none'}} key={i}>
                        <p className={'question'}>{d.message}{buttons[1 - i]}</p>
                        <FormContainer form={d}
                                       callback={(data) =>
                                           callback({credentials:new FormSerializer(data).serialize(), stage: d.stage})}>
                        </FormContainer>
                    </div>
                )
            }
        </div>
    );
}

const LoginWindow = ({callback}) => {
    const [loader, setLoader] = useState(false);
    const googleAuth = useGoogleLogin({
        onNonOAuthError: () => {
            setLoader(false);
        },
        onError: () => {
            setLoader(false);
        },
        onSuccess: tokenResponse => {
            callback({credentials: {token: tokenResponse.access_token}, setLoader});
        },
    });
    const [authType, setType] = useState('');
    return (
        <ModalForm name={'login'} data={{submitCallback: () => {
            callback(null);
            setLoader(false);
            }}}>
            {authType !== 'custom' && <div className="auth-type__buttons">
                <AuthButton type={'signin'} callback={() => {
                    LocalAuth.type = 'google';
                    setType('google');
                    googleAuth();
                    setLoader(true);
                }}><GoogleIcon></GoogleIcon>Войти через Google</AuthButton>
                <p className={'delimiter'}>ИЛИ</p>
                <AuthButton type={'signin'} callback={() => {
                    LocalAuth.type = 'custom';
                    setType('custom');
                }}>Через email</AuthButton>
            </div>}
            <LoginForm visible={authType === 'custom'}
                       callback={fields => {
                           setLoader(true);
                           callback({...fields, setLoader});
                       }}></LoginForm>
            {authType === 'custom' && <>
                <p className={'delimiter'}>ИЛИ</p>
                <AuthButton type={'signin'} callback={() => {
                    LocalAuth.type = 'google';
                    setType('google');
                    googleAuth();
                    setLoader(true);
                }}><GoogleIcon></GoogleIcon>Войти через Google</AuthButton>
            </>}
            {loader && <Spinner></Spinner>}
        </ModalForm>
    );
}

const AuthWrapper = () => {
    useLayoutEffect(() => {
        LocalAuth.auth();
    }, []);

    function toggle(isOpened) {
        window.modals.toggle('login', isOpened);
    }

    function callback(data) {
        if (!!data) {
            LocalAuth.login(data, (success) => {
                if (success) {
                    toggle(false);
                    window.callbacks.call("sidebar:toggle", false);
                    const creds = data.credentials;
                    if (creds.password) {
                        const cred = new window.PasswordCredential({
                            id: creds.email,
                            password:creds.password,
                            name: creds.email,
                        });

                        navigator.credentials.store(cred);
                    }
                }
                data.setLoader(false);
            });
        } else {
            toggle(false);
        }
    }

    function auth(login) {
        if (login) toggle(true);
        else LocalAuth.logout();
    }

    useAddEvent('user-auth', e => auth(e.detail));

    return (
        <LoginWindow callback={callback}></LoginWindow>
    );
}

const AuthContainer = () => {
    return (
        <GoogleOAuthProvider clientId={CLEINT_ID}>
            <AuthWrapper></AuthWrapper>
        </GoogleOAuthProvider>
    );
};

export default AuthContainer;