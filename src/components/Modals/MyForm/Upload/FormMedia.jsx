import React, {useLayoutEffect, useState} from 'react';
import "./FormMedia.scss";
import ItemData, {Components} from "../../../Item/components/ItemData";
import {getFile} from "../../../../modules/FileExplorer/api/google";

const FormMedia = ({file}) => {
    return (
        <div className={"upload__preview"}
                                 style={{display:"flex", flexWrap:"wrap", justifyContent:"center", maxWidth:400}}>
            <div className={"media-item"}>
                {file.type !== 'model' && <ItemData data={file}></ItemData>}
                <p className={"media-text"}>{file.filename}</p>
            </div>
        </div>
    );
}

export default FormMedia;