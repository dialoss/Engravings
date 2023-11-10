import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {ModalManager} from "components/ModalManager";
import {useAddEvent} from "hooks/useAddEvent";
import {getFormData} from "./helpers/FormData";
import MyForm from "components/Modals/MyForm/MyForm";
import {isMobileDevice, triggerEvent} from "helpers/events";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";

const ElementForm = () => {
    const windowName = "form-window:toggle";
    const [form, setForm] = useState(null);
    function handleFormData(event) {
        setForm(getFormData(event.detail));
        triggerEvent(windowName, {isOpened: true});
    }
    console.log(form)
    useAddEvent('form:set-data', handleFormData);
    return (
        <>
            {form &&
                <ModalManager name={windowName} key={windowName} defaultOpened={!!form} closeConditions={['esc', 'btn']}>
                    <TransformItem config={isMobileDevice() ? {} : {position:'fixed', left:'20%', top:'100px', width:'50%', zIndex:8}}
                                   style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}  data-type={'modal'}>
                        <FormContainer formData={form} callback={(fields) => {
                            let data = {};
                            Object.keys(fields).forEach(f => data[f] = fields[f].value);
                            if (data.path && data.slug) data.page_from = {
                                path: data.path,
                                slug: data.slug,
                            }
                            if (data.url) data.url = data.url[0].url;
                            triggerEvent("action:callback", [{...form, data}]);
                            triggerEvent(windowName, {isOpened: false});
                            setForm(null);
                        }}>
                        </FormContainer>
                    </TransformItem>
                </ModalManager>
            }
        </>
    );
}

export const FormContext = createContext();

export const FormContainer = ({formData, callback}) => {
    const [formFields, setFormFields] = useState(formData.data || {});
    const inputCallback = ({value, field}) => setFormFields(current => ({...current, [field]: {...current[field], value: value}}));
    useLayoutEffect(() => {
        setFormFields(formData.data || {});
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