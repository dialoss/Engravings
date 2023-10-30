import React, {useContext} from 'react';
import FormUpload from "./Upload/FormUpload";
import FormInput from "components/Modals/MyForm/Input/FormInput";
import FormTextarea from "components/Modals/MyForm/Textarea/FormTextarea";
import FormSelect from "./Select/FormSelect";
import {triggerEvent} from "../../../helpers/events";
import {FormContext} from "../../../modules/ActionForm/FormContainer";

const Components = {
    'upload': FormUpload,
    'input': FormInput,
    'textarea': FormTextarea,
    'select': FormSelect
}

const FormComponent = ({field}) => {
    const inputCallback = useContext(FormContext);
    let TargetComponent = Components[field.type];

    function fieldCallback(event) {
        inputCallback({field:field.name, value:event.target.value});
    }

    return (
        <TargetComponent data={{...field, callback: fieldCallback}}/>
    );
};

export default FormComponent;