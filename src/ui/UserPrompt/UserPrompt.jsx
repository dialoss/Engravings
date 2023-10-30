import React from 'react';
import {FormContainer} from "../../modules/ActionForm/FormContainer";

const UserPrompt = () => {
    return (
        <div className={"user-prompt"}>
            <p>Введите ваши данные</p>
            <FormContainer formData={{
                button: 'Подтвердить',
                data: {
                    email: {
                        name: 'email',
                        type: "input",
                        text: "Ваш email",
                        value: ''
                    },
                    name: {
                        name: 'name',
                        type: "input",
                        text: "Ваше имя",
                        value: ''
                    }
                }
            }} callback={(v) => console.log(v)}>
            </FormContainer>
        </div>
    );
};

export default UserPrompt;