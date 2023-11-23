import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";
import {fileToItem, uploadFile} from "../../modules/FileExplorer";
import {getElementByType, triggerEvent} from "../../helpers/events";
import {getLocation} from "../../hooks/getLocation";
import {getFile} from "../../modules/FileExplorer/api/google";
import {getMediaDimensions} from "../../modules/FileExplorer/helpers";

const ContentWrapper = ({children}) => {
    return (
        <>
            <TransformContainer className={'viewport-container'} data-height={'fixed'}>
                <div className="content-wrapper" onDrop={e => {
                    e.preventDefault();
                    if (getElementByType(e, 'modal')) return;
                    async function getFiles() {
                        let files = [];
                        for (const file of [...e.dataTransfer.files]) {
                            let data = await uploadFile({file, path:['site', 'storage', getLocation().pageSlug]});
                            console.log(data)
                            const f = fileToItem({...data, type: data.filetype, filename: data.name});
                            files = [...files, f];
                        }
                        for (const file of (JSON.parse(e.dataTransfer.getData('files') || "[]"))) {
                            files.push(fileToItem({...file, type: file.filetype}));
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