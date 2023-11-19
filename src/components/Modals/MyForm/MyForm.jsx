import React, {createContext, useEffect, useRef, useState} from 'react';

import './MyForm.scss';

import FormComponent from "./FormComponent";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import ActionButton from "ui/Buttons/ActionButton/ActionButton";

const FormBlock = ({formField}) => {
    const ref = useRef()
    useEffect(()=>{
        ref.current.onmousedown = e => {e.stopPropagation();console.log(e)}
    },[])
    return (
        <div className="form__block" ref={ref}>
            <p>{formField.label}</p>
            <FormComponent field={formField}></FormComponent>
        </div>
    );
}

const MyForm = ({formData, formFields, submitCallback}) => {
    const ref = useRef();
    return (
        <div className="form__content transform-origin">
            <div className="form__header">
                <p className={"form__title"}>{formData.title}</p>
                {formData.windowButton && <WindowButton type={'close'}/>}
            </div>
            <form action={''} ref={ref}>
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
                                break
                            }
                        }
                        correct && submitCallback();
                    }} type={'submit'}>{formData.button}</ActionButton>
                </div>
            </form>
        </div>
    );
};

export default MyForm;