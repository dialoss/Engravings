import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";
import {fileToItem} from "../../modules/FileExplorer/FileExplorer";
import {triggerEvent} from "../../helpers/events";

const ContentWrapper = ({children}) => {
    return (
        <TransformContainer className={'viewport-container'} height={'fixed'}>
            <div className="content-wrapper" onDrop={async e => {
                e.preventDefault();
                let files = [];
                for (const file of [...e.dataTransfer.files]) {
                    let data = await window.filemanager.settings.oninitupload(null, {folder: null, file});
                    files = [...files, fileToItem({...data, type: data.filetype, filename: data.name})];
                }
                for (const file of (JSON.parse(e.dataTransfer.getData('files') || "[]"))) {
                    files.push(file);
                }
                if (!files) return;
                triggerEvent("action:init", e);
                triggerEvent("action:callback", files);
            }} onDragOver={(e) => e.preventDefault()}>
                <div className="content">
                    {children}
                </div>
            </div>
        </TransformContainer>

    );
};

export default ContentWrapper;