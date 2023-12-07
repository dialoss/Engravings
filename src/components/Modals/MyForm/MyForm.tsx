import React, {createContext, useEffect, useRef, useState} from 'react';

import './MyForm.scss';

import FormComponent from "./FormComponent";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import ActionButton from "ui/Buttons/ActionButton/ActionButton";
import {isMobileDevice} from "../../../helpers/events";

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
    useEffect(() => {
        !isMobileDevice() && setTimeout(()=>{
            ref.current.querySelector('.input-submit').focus();
        },10)
    }, [formData]);
    return (
        <form action={''} ref={ref} className={'scrollable'} autoComplete={'on'}>
            <div className={"form__fields"}>
                {
                    Object.keys(formFields).map((key) =>
                        formFields[key].name && <FormBlock formField={formFields[key]} key={key}/>).filter(Boolean)
                }
                <div style={{width:0,height:0, opacity:0, position:'absolute'}}>
                    <input type="text" className={'input-submit'}/>
                </div>
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
    );
};

export default MyForm;