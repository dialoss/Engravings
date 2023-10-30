import React from 'react';
import FormOption from "./FormOption";
import './FormSelect.scss';

const FormSelect = ({data}) => {
    return (
        <select value={data.value} className="form-select" autoComplete="off" onChange={data.callback}>
            {
                Object.values(data.attrs).map((option, index) => {
                    return <FormOption hidden={option.hidden || ""}
                                       value={option.name}
                                       text={option.value}
                                       key={index}></FormOption>
                })
            }
        </select>
    );
};

export default FormSelect;