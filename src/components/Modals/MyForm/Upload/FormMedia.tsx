//@ts-nocheck
import React from 'react';
import "./FormMedia.scss";
import ItemData from "../../../Item/components/ItemData";

const FormMedia = ({files}) => {
    return (
        <div className={"upload__preview"}
                                 style={{display:"flex", flexWrap:"wrap", justifyContent:"center", maxWidth:400}}>
            {
                files.map(file => file.type && <div className={"media-item"} key={file.url}>
                    {!file.type.match(/model/) && <ItemData data={file}></ItemData>}
                    <p className={"media-text"}>{file.filename}</p>
                </div>)
            }
        </div>
    );
}

export default FormMedia;