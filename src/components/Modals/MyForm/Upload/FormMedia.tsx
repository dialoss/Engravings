//@ts-nocheck
import React, {useLayoutEffect, useState} from 'react';
import "./FormMedia.scss";
import ItemData, {Components} from "../../../Item/components/ItemData";
import {getFile} from "../../../../modules/FileExplorer/api/google";

const FormMedia = ({files}) => {
    return (
        <div className={"upload__preview"}
                                 style={{display:"flex", flexWrap:"wrap", justifyContent:"center", maxWidth:400}}>
            {
                files.map(file => <div className={"media-item"} key={file.url}>
                    {file.type !== 'model' && <ItemData data={file}></ItemData>}
                    <p className={"media-text"}>{file.filename}</p>
                </div>)
            }
        </div>
    );
}

export default FormMedia;