import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {submitForm} from "./api/submitForm";
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import {getFormData} from "./helpers/FormData";
import MyForm from "components/Modals/MyForm/MyForm";
import {triggerEvent} from "helpers/events";

const ElementForm = () => {
    const windowName = "form-window:toggle";
    const [form, setForm] = useState(null);
    function handleFormData(event) {
        setForm(getFormData(event.detail.type, event.detail.element));
    }

    useAddEvent('form:set-data', handleFormData);

    useEffect(() => {
        form && triggerEvent(windowName, {isOpened: true});
    }, [form]);

    return (
        <>
            {form &&
                <ModalManager name={windowName} key={windowName}>
                    <FormContainer formData={form} callback={(fields) => {
                        submitForm({...form, data: fields});
                        triggerEvent(windowName, {isOpened: false});}}>
                    </FormContainer>
                </ModalManager>
            }
        </>
    );
}

export const FormContext = createContext();

export const FormContainer = ({formData, callback}) => {
    const [formFields, setFormFields] = useState(formData.data);
    const inputCallback = ({value, field}) => setFormFields(current => ({...current, [field]: {...current[field], value: value}}));
    useLayoutEffect(() => {
        setFormFields(formData.data);
    }, [formData]);

    return (
        <FormContext.Provider value={inputCallback}>
            <MyForm formData={formData}
                    formFields={formFields}
                    submitCallback={() => callback(formFields)}></MyForm>
        </FormContext.Provider>
    );
};

export default ElementForm;