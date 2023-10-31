import React, {useEffect, useState} from 'react';
import './FormUpload.scss';
import FormMedia from "./FormMedia";
import {triggerEvent} from "../../../../helpers/events";

const FormUpload = ({data}) => {
    const [upload, setUpload] = useState([]);
    useEffect(() => {
        setUpload(data.value);
    }, [data]);
    return (
        <div className={"form-upload"}>
            <div className={"action-button"} onClick={() =>
                triggerEvent("filemanager:open", {callback: (file) => data.callback({target:{value:file}})})}>{data.label}</div>
            {!upload.length && <span className="form-upload__text">{`No ${data.name} chosen...`}</span>}
            {!!upload.length && <FormMedia files={upload}/>}
        </div>
    );
};

export default FormUpload;