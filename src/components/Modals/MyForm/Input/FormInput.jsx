import React from 'react';
import './FormInput.scss';

const FormInput = ({data, ...props}) => {
    let attrs = {};
    data.attrs && data.attrs.forEach(attr => {
        attrs[attr] = attr;
    });
    return (
        <input {...attrs}
               name={data.name}
               value={data.value}
                {...props}
                type={data.validate || 'input'}
               onChange={data.callback}
               minLength={data.min_length || 0}
               autoComplete={data.name}
               className="form-input"/>
    );
};

export default FormInput;