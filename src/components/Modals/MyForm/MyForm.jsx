import React, {createContext, useState} from 'react';

import './MyForm.scss';

import FormComponent from "./FormComponent";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import ActionButton from "ui/Buttons/ActionButton/ActionButton";

const FormBlock = ({formField}) => {
    return (
        <div className="form__block">
            <p>{formField.label}</p>
            <FormComponent field={formField}></FormComponent>
        </div>
    );
}

const MyForm = ({formData, formFields, submitCallback}) => {
    return (
        <div className="form__content">
            <div className="form__header">
                <p className={"form__title"}>{formData.title}</p>
                {formData.windowButton && <WindowButton type={'close'}/>}
            </div>
            <div className={"form__fields"}>
                {
                    Object.keys(formFields).map((key) => {
                        return <FormBlock formField={formFields[key]} key={key}/>
                    })
                }
                <ActionButton onClick={submitCallback}>{formData.button}</ActionButton>
            </div>
        </div>
    );
};

export default MyForm;