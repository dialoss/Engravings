//@ts-nocheck
import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ModalManager} from "components/ModalManager";
import MyForm from "components/Modals/MyForm/MyForm";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {IForm, IFormFields} from "./helpers/FormData";
import WindowButton from "../../ui/Buttons/WindowButton/WindowButton";

const ModalForm = ({children, data=null, name, backgroundClose=true}) => {
    const [form, setForm] = useState<IForm>(data);
    useEffect(() => {
        window.callbacks.register(name, (data: IForm) => {
            setForm(data);
            window.modals.open(name);
        });
    }, []);
    console.log('FORRRRRM',form)
    return (
        <ModalManager name={name} key={name} style={{bg:'bg-none', win: 'centered'}}
                      callback={(o) => !o && form && form.submitCallback(false)}
                      closeConditions={['esc', 'btn', backgroundClose ? 'bg' : '']}>
            <TransformItem style={{}} type={'modal'}>
                {form && <FormContainer form={form} callback={fields => {
                    form.submitCallback(fields);
                    window.modals.close(name);
                    setForm(null);
                }}>{children}
                </FormContainer>}
            </TransformItem>
        </ModalManager>
    );
}

export const FormContext = createContext<{
    inputCallback: any;
    setFormFields: any;
}>(null);

type FormContainerProps = {
    form: IForm,
    callback: (...args: any[]) => any;
    children?: React.ReactNode;
}

export const FormContainer = ({form, callback, children} : FormContainerProps) => {
    const [formFields, setFormFields] = useState<IFormFields>({});
    const inputCallback = ({value, field} : {value: any; field: string}) =>
        setFormFields(current => ({...current, [field]: {...current[field], value: value}}));

    useLayoutEffect(() => {
        setFormFields(form.data || {});
    }, [form]);
    console.log(formFields)

    return (
        <FormContext.Provider value={{inputCallback, setFormFields}}>
            <div className={"form__content " + form.style}>
                <div className="form__header">
                    <p className={"form__title"}>{form.title}</p>
                    {form.windowButton && <WindowButton onClick={() => callback(false)} type={'close'}/>}
                </div>
            {children ? children : <MyForm form={form}
                                           submitCallback={() => callback(formFields)}
                                           formFields={formFields}></MyForm>}
            </div>
        </FormContext.Provider>
    );
};

export default ModalForm;