export const loginForm = {
    title: 'Вход',
    stage: 'login',
    button: 'Подтвердить',
    data:
        {
            email: {
                name: 'email',
                type: "input",
                validate: 'email',
                attrs: ['required'],
                label: "Email",
                value: ''
            },
            password: {
                name: 'password',
                type: 'input',
                attrs: ['required'],
                label: 'Пароль',
                value: '',
            }
        }
};

export const registerForm = {
    title: 'Регистрация',
    button: 'Подтвердить',
    stage: 'register',
    data: {
        email: {
            name: 'email',
            type: "input",
            validate: 'email',
            attrs: ['required'],
            label: "Email",
            value: ''
        },
        name: {
            name: 'name',
            type: "input",
            attrs: ['required'],
            label: "Имя",
            min_length: 5,
            value: ''
        },
        password: {
            name: 'password',
            type: 'input',
            attrs: ['required'],
            min_length: 8,
            label: 'Пароль',
            value: '',
        }
    }
}