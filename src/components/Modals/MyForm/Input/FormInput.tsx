//@ts-nocheck
import React from 'react';
import './FormInput.scss';

const FormInput = ({data, ...props}) => {
    let attrs = {};
    data.attrs && data.attrs.forEach(attr => {
        attrs[attr] = attr;
    });
    return (
        <>
            <label htmlFor={data.name} style={{display:'none'}}></label>
            <input {...attrs}
                   value={data.value}
                   name={data.name}
                   {...props}
                   type={data.validate || 'input'}
                   onChange={data.callback}
                   minLength={data.min_length || 0}
                   autoComplete={data.autocomplete || data.name}
                   className="form-input"/>
        </>

    );
};

export default FormInput;