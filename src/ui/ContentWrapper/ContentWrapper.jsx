import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";
import {fileToItem} from "../../modules/FileExplorer/FileExplorer";
import {triggerEvent} from "../../helpers/events";

const ContentWrapper = ({children}) => {
    return (
        <>
            <TransformContainer className={'viewport-container'} data-height={'fixed'}>
                <div className="content-wrapper" onDrop={e => {
                    e.preventDefault();
                    async function getFiles() {
                        let files = [];
                        for (const file of [...e.dataTransfer.files]) {
                            let data = await window.filemanager.settings.oninitupload(null, {folder: null, file});
                            const f = await fileToItem({...data, type: data.filetype, filename: data.name});
                            files = [...files, f];
                        }
                        for (const file of (JSON.parse(e.dataTransfer.getData('files') || "[]"))) {
                            files.push(await fileToItem(file));
                        }
                        if (!files) return;
                        triggerEvent("action:init", e);
                        triggerEvent("action:callback", files);
                    }
                    getFiles();
                }} onDragOver={(e) => e.preventDefault()}>
                    {children}
                </div>
            </TransformContainer>
        </>
    );
};

export default ContentWrapper;