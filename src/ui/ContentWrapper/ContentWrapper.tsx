import React from 'react';
import "./ContentWrapper.scss";
import {getElementByType, triggerEvent} from "../../helpers/events";
import {storage} from "../../modules/FileExplorer/api/storage";
import {UploadStatus} from "../../modules/FileExplorer/api/google";

const ContentWrapper = ({children}) => {
    return (
        <div className={'viewport-container'}>
            <div className="content-wrapper" onDrop={e => {
                triggerEvent("action:init", e);
                if (getElementByType(e, 'modal')) return;
                storage.transferFiles(e, (status: UploadStatus) => console.log(status));
            }} onDragOver={(e) => e.preventDefault()}>
                {children}
            </div>
        </div>
    );
};

export default ContentWrapper;