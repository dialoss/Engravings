import React from 'react';
import "./FormMedia.scss";
import {Components} from "../../../Item/components/ItemData";

const FormMedia = ({files}) => {
    return (
        <div className={"upload__preview"}
                                 style={{display:"flex", flexWrap:"wrap", justifyContent:"center", maxWidth:400}}>
            {
                Object.values(files).map((file,index) =>
                    <div className={"media-item"} key={index}>
                        {React.createElement(Components[file.type], {data: file})}
                        <p className={"media-text"}>{file.filename}</p>
                    </div>
                )
            }
        </div>
    );
}

export default FormMedia;