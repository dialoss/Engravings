//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import './FormUpload.scss';
import FormMedia from "./FormMedia";
import {FormContext} from "../../../../modules/ActionForm/FormContainer";
import FormInput from "../Input/FormInput";

const FormUpload = ({data}) => {
    const inputCallback = useContext(FormContext).inputCallback;
    const [upload, setUpload] = useState([]);
    useEffect(() => {
        setUpload(data.value);
    }, [data]);
    return (
        <div className={"form-upload"}>
            <div className={'action-button'} onClick={() =>
                window.filemanager.select(files => inputCallback({field: 'url', value: files}))
            }>{data.label}</div>
            {!upload.length && <span className="form-upload__text">{`No ${data.name} chosen...`}</span>}
            {!!upload.length && <FormMedia files={upload}/>}
            ИЛИ
            <FormInput data={{...data, value: (data[0] || {}).url, callback: e =>
                    inputCallback({field: 'url', value: [{url:e.target.value}]})}}></FormInput>
        </div>
    );
};

export default FormUpload;