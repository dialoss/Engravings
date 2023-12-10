//@ts-nocheck
import React, {useContext, useEffect, useState} from 'react';
import './FormUpload.scss';
import FormMedia from "./FormMedia";
import {triggerEvent} from "../../../../helpers/events";
import {FormContext} from "../../../../modules/ActionForm/FormContainer";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";

const FormUpload = ({data}) => {
    const inputCallback = useContext(FormContext).inputCallback;
    const [upload, setUpload] = useState([]);
    useEffect(() => {
        setUpload(data.value);
    }, [data]);
    return (
        <div className={"form-upload"}>
            <div className={'action-button'} onClick={() =>
                triggerEvent("filemanager:select", {
                    callback: (files) => inputCallback({field: 'url', value: files})
                })}>{data.label}</div>
            {!upload.length && <span className="form-upload__text">{`No ${data.name} chosen...`}</span>}
            {!!upload.length && <FormMedia files={upload}/>}
        </div>
    );
};

export default FormUpload;