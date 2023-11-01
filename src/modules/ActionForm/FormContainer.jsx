import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import {getFormData} from "./helpers/FormData";
import MyForm from "components/Modals/MyForm/MyForm";
import {triggerEvent} from "helpers/events";

const ElementForm = () => {
    const windowName = "form-window:toggle";
    const [form, setForm] = useState(null);
    function handleFormData(event) {
        setForm(getFormData(event.detail));
        triggerEvent(windowName, {isOpened: true});
    }

    useAddEvent('form:set-data', handleFormData);
    return (
        <>
            {form &&
                <ModalManager name={windowName} key={windowName} defaultOpened={!!form} closeConditions={['esc', 'btn']}>
                    <FormContainer formData={form} callback={(fields) => {
                        let data = {};
                        Object.keys(fields).forEach(f => data[f] = fields[f].value);
                        if (data.path && data.slug) data.page_from = {
                            path: data.path,
                            slug: data.slug,
                        }
                        if (data.url) data.url = data.url[0].url;
                        triggerEvent("action:callback", [{...form, ...data}]);
                        triggerEvent(windowName, {isOpened: false});
                        setForm(null);
                    }}>
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
    console.log(formFields)
    return (
        <FormContext.Provider value={inputCallback}>
            <MyForm formData={formData}
                    formFields={formFields}
                    submitCallback={() => callback(formFields)}></MyForm>
        </FormContext.Provider>
    );
};

export default ElementForm;