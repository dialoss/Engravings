import React, {useContext} from 'react';
import {FormContext} from "../../../../modules/ActionForm/FormContainer";

const FormCheckbox = ({data}) => {
    const inputCallback = useContext(FormContext).inputCallback;
    return (
        <input name={data.name}
               type={'checkbox'}
               checked={!!data.value}
               onChange={v => inputCallback({field: data.name, value: v.target.checked})}
               className="form-checkbox"/>
    );
};

export default FormCheckbox;