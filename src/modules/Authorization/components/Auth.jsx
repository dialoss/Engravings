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
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import WindowButton from "../../../ui/Buttons/WindowButton/WindowButton";
import Avatar from "../../../ui/Avatar/Avatar";

const userStore = (data) => store.dispatch(actions.setUser(data));

class LocalAuth {
    static type = '';
    static setUser(data) {
        if (data.auth) {
            userStore({...data.user, authenticated: true});
        } else {
            data.error && alert(data.error);
        }
    }
    static login(data) {
        sendLocalRequest('/api/user/login/', {...data, type: LocalAuth.type}, 'POST').then(data => {
            LocalAuth.setUser(data);
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

function serializeFields(fields) {
    let newFields = {};
    for (const f in fields) {
        newFields[f] = fields[f].value;
    }
    return newFields;
}

const MyLoginForm = ({callback}) => {
    const data = [loginForm, registerForm];
    const [stage, setStage] = useState(0);
    const buttons = data.map((d, i) =>
                <ActionButton onClick={()=>setStage(i)} key={i}>{d.title}</ActionButton>);
    return (
      <>
          {
              data.map((d, i) =>
                  <div className={'form-wrapper'} style={{display: stage===i?'block':'none'}} key={i}>
                      <p className={'question'}>{d.message}{buttons[1 - i]}</p>
                      <FormContainer formData={d}
                                     callback={(data) =>
                                         callback({credentials:serializeFields(data), stage: d.stage})}>
                      </FormContainer>
                  </div>
              )
          }
      </>
    );
}

const LoginForm = ({props}) => {
    const {callback, type, isOpened} = props;

    const googleAuth = useGoogleLogin({
        onSuccess: tokenResponse => {
            LocalAuth.login({credentials: {token: tokenResponse.access_token}});
        },
    });

    const [authType, setType] = useState('');
    //console.log(isOpened)

    return (
        <ModalManager name={'login-form:toggle'}
                      defaultOpened={isOpened}
                      callback={(v) => !v && callback && callback()}>
            <div className={'login-form ' + type} style={{bg: 'bg-none', win:'centered'}}>
                <WindowButton type={'close'}></WindowButton>
                <p style={{fontSize: 25, padding:'20px'}}>Авторизация</p>
                <div className="auth-type__buttons">
                    <AuthButton type={'signin'} callback={() => {
                        LocalAuth.type = 'google';
                        setType('google');
                        googleAuth();
                    }}>Войти через Google</AuthButton>
                    <p className={'delimiter'}>ИЛИ<span></span></p>
                    <AuthButton type={'signin'} callback={() => {
                        LocalAuth.type = 'custom';
                        setType('custom');
                    }}>Через email</AuthButton>
                </div>
                {authType === 'custom' && <MyLoginForm callback={callback}></MyLoginForm>}
            </div>
        </ModalManager>
    );
}

const Auth = ({children}) => {
    const user = useSelector(state => state.users.current);

    useLayoutEffect(() => {
        LocalAuth.auth();
    }, []);

    function auth(popup) {
        setPrompt({isOpened: true, type: (popup ? 'popup' : 'default'),
            callback: (data) => {
            if (!!data) LocalAuth.login(data);
            setPrompt({isOpened: false});
        }})
    }

    useAddEvent('user-auth', e => auth(e.detail));

    const [prompt, setPrompt] = useState({isOpened: false, callback:null});
    return (
        <div className={"auth"}>
            <div className={"user-profile " + ((getLocation().relativeURL === '/customer/') ? 'active' : '')}>
                {!user.authenticated &&
                    <AuthButton type={'choice'} callback={auth}>Вход</AuthButton>
                }
                <LoginForm props={prompt}></LoginForm>
                {user.authenticated && <>
                    <div className="wrapper">
                        {children}
                        <Avatar src={user.picture} user={user}></Avatar>
                        <h3>{user.name}</h3>
                    </div>
                    <AuthButton type={'logout'} callback={LocalAuth.logout}>Выйти</AuthButton>
                </>}
            </div>
        </div>
    );
};

export default Auth;