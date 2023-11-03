import React, {useLayoutEffect, useRef, useState} from 'react';
import "./Auth.scss";
import AuthButton from "./AuthButton";
import {useGoogleLogin} from "@react-oauth/google";
import {sendLocalRequest, sendRequest} from "../../../api/requests";
import {actions} from "../store/user/reducers";
import {getLocation} from "../../../hooks/getLocation";
import AccordionContainer from "../../../ui/Accordion/AccordionContainer";
import {loginForm, registerForm} from "../forms/loginForm";
import store from "../../../store";
import {FormContainer} from "../../ActionForm/FormContainer";
import {useSelector} from "react-redux";
import {triggerEvent} from "../../../helpers/events";
import {useAddEvent} from "../../../hooks/useAddEvent";
import {ModalManager} from "../../../components/ModalManager";


class LocalAuth {
    static type = '';
    static setUser(user) {
        store.dispatch(actions.setUser(user));
    }
    static login(data) {
        sendLocalRequest('/api/user/login/', {...data, type: LocalAuth.type}, 'POST').then(data => {
            console.log(data)
            if (data.auth) {
                LocalAuth.setUser({...data.user, authenticated: true});
            } else {
                alert(data.error);
            }
        });
    }

    static auth() {
        sendLocalRequest('/api/user/auth/').then(data => {
            if (data.auth) {
                LocalAuth.setUser({...data.user, authenticated: true});
            } else {
                alert(data.error);
            }
        });
    }

    static logout() {
        LocalAuth.setUser({authenticated: false});
        sendLocalRequest('/api/user/logout/');
    }
}

function serializeFields(fields) {
    let newFields = {};
    for (const f in fields) {
        newFields[f] = fields[f].value;
    }
    return newFields;
}

const LoginForm = ({callback, type}) => {
    const data = [loginForm, registerForm];
    const [stage, setStage] = useState(0);
    return (
        <ModalManager name={'login-form:toggle'} defaultOpened={true} callback={(v) => !v && callback()}>
            <div className={'login-form ' + type}>
                <div className="buttons">
                    {
                        data.map((d, i) =>
                            <button onClick={()=>setStage(i)} key={i}>{d.title}</button>
                        )
                    }
                </div>
                {
                    data.map((d, i) =>
                        <div className={'form-wrapper'} style={{display: stage===i?'block':'none'}} key={i}>
                            <FormContainer formData={d}
                                           callback={(data) =>
                                               callback({credentials:serializeFields(data), stage: d.stage})}>
                            </FormContainer>
                        </div>
                    )
                }
            </div>
        </ModalManager>
    );
}

const Auth = ({children}) => {
    const user = useSelector(state => state.users.current);
    const googleAuth = useGoogleLogin({
        onSuccess: tokenResponse => {
            LocalAuth.login({credentials: {token: tokenResponse.access_token}});
        },
    });
    useLayoutEffect(() => {
        LocalAuth.auth();
    }, []);

    function localAuth(popup) {
        LocalAuth.type = 'custom';
        setPrompt({isOpened: true, type: (popup ? 'popup' : 'default'),
            callback: (data) => {
            if (!!data) LocalAuth.login(data);
            setPrompt({isOpened: false});
        }})
    }

    useAddEvent('user-auth', e => localAuth(e.detail));

    const [prompt, setPrompt] = useState({isOpened: false, callback:null});
    return (
        <div className={"auth"}>
            <div className={"user-profile " + ((getLocation().relativeURL === '/customer/') ? 'active' : '')}>
                {!user.authenticated &&
                        <AccordionContainer header={<AuthButton type={'choice'}>Вход</AuthButton>}>
                            <div className={'auth-choice'}>
                                <p>Выберите способ входа</p>
                                <AuthButton type={'signin'} callback={() => {
                                    LocalAuth.type = 'google';
                                    googleAuth();
                                }}>Google</AuthButton>
                                <AuthButton type={'my-login'} callback={() => localAuth(false)}>Локально</AuthButton>
                            </div>
                        </AccordionContainer>
                }
                {prompt.isOpened && <LoginForm callback={prompt.callback} type={prompt.type}></LoginForm>}
                {user.authenticated && <>
                    {children}
                    <img src={user.picture} alt=""/>
                    <h3>{user.name}</h3>
                    <AuthButton type={'logout'} callback={LocalAuth.logout}>Выйти</AuthButton>
                </>}
            </div>
        </div>
    );
};

export default Auth;