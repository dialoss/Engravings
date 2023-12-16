//@ts-nocheck
import React, {useEffect, useRef} from 'react';

import './MyForm.scss';

import FormComponent from "./FormComponent";
import ActionButton from "ui/Buttons/ActionButton/ActionButton";
import {isMobileDevice} from "../../../helpers/events";
import {IForm, IFormField, IFormFields} from "../../../modules/ActionForm/helpers/FormData";

const FormBlock = ({formField} : {formField: IFormField}) => {
    return (
        <div className="form__block">
            <p>{formField.label}</p>
            <FormComponent field={formField}></FormComponent>
        </div>
    );
}

type FormProps = {
    form: IForm;
    formFields: IFormFields;
    submitCallback: any;
}

const MyForm = ({form, formFields, submitCallback} : FormProps) => {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        !isMobileDevice() && setTimeout(()=>{
            ref.current.querySelector('.input-submit').focus();
        },10)
    }, [form]);
    function validateForm(e) {
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
    }

    return (
        <form action={''} ref={ref} className={'scrollable'} autoComplete={'on'}>
            <div className={"form__fields"}>
                {
                    Object.keys(formFields).map((key) =>
                        <FormBlock formField={formFields[key]} key={key}/>)
                }
                <div style={{width:0,height:0, opacity:0, position:'absolute'}}>
                    <input type="text" className={'input-submit'}/>
                </div>
                <ActionButton onClick={validateForm} type={'submit'}>{form.button}</ActionButton>
            </div>
        </form>
    );
};

export default MyForm;