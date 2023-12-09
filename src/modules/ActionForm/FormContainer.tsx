import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import MyForm from "components/Modals/MyForm/MyForm";
import {isMobileDevice, triggerEvent} from "helpers/events";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {serializeFields} from "./helpers/FormData";
import WindowButton from "../../ui/Buttons/WindowButton/WindowButton";



const ModalForm = ({children, data=null, name, backgroundClose=true}) => {
    const [form, setForm] = useState(data);
    useEffect(() => {
        // window.modals.all[name].openCallback = e => setForm(e.detail);
    }, []);
    return (
        <ModalManager name={name} key={name} style={{bg:'bg-none', win: 'centered'}}
                      callback={(o) => !o && form && form.submitCallback && form.submitCallback(false)}
                      closeConditions={['esc', 'btn', backgroundClose ? 'bg' : '']}>
            <TransformItem style={{}} type={'modal'}>
                {form && <FormContainer formData={form} callback={form.submitCallback ? (value) => {
                    form.submitCallback(value);
                    window.modals.close(name);
                } : ((fields) => {
                    window.modals.close(name);
                    setForm(null);
                    if (!fields) return;
                    let data = serializeFields(fields, form.method);
                })}>{children}
                </FormContainer>}
            </TransformItem>
        </ModalManager>
    );
}

export const FormContext = createContext({});

export const FormContainer = ({formData, callback, children}) => {
    const [formFields, setFormFields] = useState(formData.data || {});
    const inputCallback = ({value, field}) => setFormFields(current => ({...current, [field]: {...current[field], value: value}}));
    useLayoutEffect(() => {
        setFormFields(formData.data || {});
    }, [formData]);
    console.log(formFields)

    return (
        <FormContext.Provider value={{inputCallback, setFormFields}}>
            <div className={"form__content " + (formData.style || '')}>
                <div className="form__header">
                    <p className={"form__title"}>{formData.title}</p>
                    {formData.windowButton === false ? <></> :
                        <WindowButton onClick={() => callback(false)} type={'close'}/>}
                </div>
            {children ? children : <MyForm formData={formData}
                    formFields={formFields}
                    submitCallback={() => callback(formFields)}></MyForm>}
            </div>
        </FormContext.Provider>
    );
};

export default ModalForm;