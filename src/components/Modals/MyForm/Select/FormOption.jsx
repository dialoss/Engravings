import React from 'react';

const FormOption = ({value, text, ...props}) => {
    return (
        <option {...props} value={value}>{text}</option>
    );
};

export default FormOption;