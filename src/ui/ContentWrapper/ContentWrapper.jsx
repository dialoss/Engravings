import React from 'react';
import "./ContentWrapper.scss";
import TransformContainer from "../ObjectTransform/components/TransformContainer/TransformContainer";
import {fileToItem, uploadFile} from "../../modules/FileExplorer";
import {getElementByType, triggerEvent} from "../../helpers/events";
import {getLocation} from "../../hooks/getLocation";
import {dropUpload, getFile} from "../../modules/FileExplorer/api/google";
import {getMediaDimensions} from "../../modules/FileExplorer/helpers";

const ContentWrapper = ({children}) => {
    return (
        <>
            <TransformContainer className={'viewport-container'} data-height={'fixed'}>
                <div className="content-wrapper" onDrop={e => {
                    if (getElementByType(e, 'modal')) return;
                    dropUpload(e, files => {
                        triggerEvent("action:init", e);
                        triggerEvent("action:callback", files);
                    })
                }} onDragOver={(e) => e.preventDefault()}>
                    {children}
                </div>
            </TransformContainer>
        </>
    );
};

export default ContentWrapper;