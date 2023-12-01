import React from 'react';
import FormOption from "./FormOption";
import './FormSelect.scss';

const FormSelect = ({data}) => {
    return (
        <select value={data.value} className="form-select" autoComplete="off" onChange={data.callback}>
            {
                Object.keys(data.options).map(option => {
                    return <FormOption value={option}
                                       text={data.options[option]}
                                       key={option}></FormOption>
                })
            }
        </select>
    );
};

export default FormSelect;