//@ts-nocheck
import React, {useContext} from 'react';
import FormUpload from "./Upload/FormUpload";
import FormInput from "components/Modals/MyForm/Input/FormInput";
import FormTextarea from "components/Modals/MyForm/Textarea/FormTextarea";
import FormSelect from "./Select/FormSelect";
import {FormContext} from "../../../modules/ActionForm/FormContainer";
import FormCheckbox from "./Checkbox/FormCheckbox";
import Slider from "./Slider/Slider";
import {IFormField} from "../../../modules/ActionForm/helpers/FormData";

const ColorPicker = ({data}) => {
    return (
        <input type="color" name="" id="" value={data.value} onChange={data.callback}/>
    )
}

const Components = {
    'upload': FormUpload,
    'input': FormInput,
    'textarea': FormTextarea,
    'select': FormSelect,
    'checkbox': FormCheckbox,
    'color': ColorPicker,
    'slider': Slider,
}

const FormComponent = ({field} : {field: IFormField}) => {
    const inputCallback = useContext(FormContext).inputCallback;
    let TargetComponent = Components[field.type];

    function fieldCallback(event) {
        inputCallback({field:field.name, value:event.target.value});
    }

    return (
        <TargetComponent data={{...field, callback: fieldCallback}}/>
    );
};

export default FormComponent;