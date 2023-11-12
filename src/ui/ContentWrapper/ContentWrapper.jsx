import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";
import {fileToItem, uploadFile} from "../../modules/FileExplorer";
import {triggerEvent} from "../../helpers/events";
import {getLocation} from "../../hooks/getLocation";

const ContentWrapper = ({children}) => {
    return (
        <>
            <TransformContainer className={'viewport-container'} data-height={'fixed'}>
                <div className="content-wrapper" onDrop={e => {
                    e.preventDefault();
                    async function getFiles() {
                        let files = [];
                        for (const file of [...e.dataTransfer.files]) {
                            let fullsize = await uploadFile({folder: null, file,
                                path:['fullsize', ...getLocation().relativeURL.slice(1, -1).split('/')], compress:false});
                            let data = await uploadFile({folder: null, file,
                                path:getLocation().relativeURL.slice(1, -1).split('/'), compress:true});
                            const f = await fileToItem({...data, url_fullsize: fullsize.url, type: data.filetype, filename: data.name});
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