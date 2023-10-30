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
               onChange={data.callback}
               className="form-input"/>
    );
};

export default FormInput;