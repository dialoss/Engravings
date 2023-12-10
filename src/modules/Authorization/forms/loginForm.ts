//@ts-nocheck
import {IForm} from "../../ActionForm/helpers/FormData";

export interface CustomForm extends IForm {
    message: string;
    stage: string;
}

export const loginForm = {
    title: 'Вход',
    stage: 'login',
    button: 'Войти',
    style: 'inline',
    message: 'Впервые на сайте? ',
    data: {
        email: {
            name: 'email',
            type: "input",
            validate: 'email',
            attrs: ['required'],
            label: "Email",
            autocomplete: 'name',
            value: ''
        },
        password: {
            name: 'password',
            type: 'input',
            attrs: ['required'],
            label: 'Пароль',
            value: '',
            autocomplete: 'current-password',
            validate: 'password',
        }
    }
};

export const registerForm = {
    title: 'Регистрация',
    button: 'Зарегистрироваться',
    stage: 'register',
    style: 'inline',
    message: 'Уже зарегистрированы? ',
    data: {
        email: {
            name: 'email',
            type: "input",
            validate: 'email',
            attrs: ['required'],
            label: "Email",
            autocomplete: 'email',
            value: '',
        },
        name: {
            name: 'name',
            type: "input",
            attrs: ['required'],
            label: "Имя",
            min_length: 5,
            value: '',
            autocomplete: '',
        },
        password: {
            name: 'password',
            type: 'input',
            attrs: ['required'],
            min_length: 8,
            label: 'Пароль',
            value: '',
            autocomplete: 'new-password',
        }
    }
}