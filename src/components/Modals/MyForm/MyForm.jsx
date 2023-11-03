import React, {createContext, useRef, useState} from 'react';

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
    const ref = useRef();
    return (
        <form className="form__content" action={''} ref={ref}>
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
                <ActionButton onClick={(e) => {
                    e.preventDefault();

                    const form = ref.current;
                    let correct = true;
                    for (const field of [...form].slice(0, -1)) {
                        if (!field.checkValidity()) {
                            correct = false;
                            field.reportValidity();
                        }
                    }
                    correct && submitCallback();
                }} type={'submit'}>{formData.button}</ActionButton>
            </div>
        </form>
    );
};

export default MyForm;