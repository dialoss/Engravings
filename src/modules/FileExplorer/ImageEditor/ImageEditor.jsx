import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./ImageEditor.scss";
import {getLocation} from "../../../hooks/getLocation";
import {uploadFile} from "../api/google";
import {getViewportWidth} from "../../../ui/helpers/viewport";
const { TABS, TOOLS } = window.FilerobotImageEditor;

export function ImageEditor({image}) {
    console.log(image)
    useLayoutEffect(()=>{
        if (!image.image) return;
        const config = {
            theme: {
                palette: {
                    'bg-primary-active': '#ECF3FF',
                },
                typography: {
                    fontFamily: 'Roboto, Arial',
                },
            },
            source: image.image,
            defaultSavedImageName: image.meta.name,
            defaultSavedImageQuality: 100,
            onSave: (img, designState) => {
                let blobBin = atob(img.imageBase64.split(',')[1]);
                let array = [];
                for (let i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                const file = new Blob([new Uint8Array(array)], {type: img.mimeType});
                file.name = img.fullName;
                uploadFile({file, folder:image.folder.GetPathIDs().slice(-1)[0]});
                },
            annotationsCommon: {
                fill: '#000000'
            },
            Text: { text: 'Привет' },
            Rotate: { angle: 90, componentType: 'slider' },
            tabsIds: [TABS.ADJUST,TABS.ANNOTATE, TABS.FINETUNE, TABS.RESIZE,],
            defaultTabId: TABS.ANNOTATE,
            defaultToolId: TOOLS.PEN,
        };

        const filerobotImageEditor = new window.FilerobotImageEditor(
            document.querySelector('.image-editor'),
            config
        );

        filerobotImageEditor.render({
            onClose: (closingReason) => {
                filerobotImageEditor.terminate();
            }
        });
    },[image]);
    return (
        <div className={'image-editor'}></div>
    );
}