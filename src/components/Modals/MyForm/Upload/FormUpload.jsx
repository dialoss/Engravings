import React, {useContext, useEffect, useState} from 'react';
import './FormUpload.scss';
import FormMedia from "./FormMedia";
import {triggerEvent} from "../../../../helpers/events";
import {FormContext} from "../../../../modules/ActionForm/FormContainer";

const FormUpload = ({data}) => {
    const inputCallback = useContext(FormContext);
    const [upload, setUpload] = useState({});
    useEffect(() => {
        setUpload(data.value[0] || data.value);
    }, [data]);
    return (
        <div className={"form-upload"}>
            <div className={"action-button"} onClick={() =>
                triggerEvent("filemanager:open", {
                    callback: (file) => {
                        for (const field of ['width','height','filename','type']) {
                            inputCallback({field, value: file[field]});
                        }
                        inputCallback({field: 'url', value: file});
                    }
                })}>{data.label}</div>
            {!upload.url && <span className="form-upload__text">{`No ${data.name} chosen...`}</span>}
            {!!upload.url && <FormMedia file={upload}/>}
        </div>
    );
};

export default FormUpload;