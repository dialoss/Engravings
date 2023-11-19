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
            source: image.image,
            defaultSavedImageName: image.meta.name,
            onSave: (img, designState) => {
                let blobBin = atob(img.imageBase64.split(',')[1]);
                let array = [];
                for (let i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                const file = new Blob([new Uint8Array(array)], {type: img.mimeType});
                file.name = img.fullName;
                console.log(img)
                window.filemanager.settings.oninitupload(null, {file, folder:image.folder, compress:true});
                },
            annotationsCommon: {
                fill: '#ffffff'
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
                console.log('Closing reason', closingReason);
                filerobotImageEditor.terminate();
            }
        });
    },[image]);
    const ref = useRef();
    useEffect(() => {
        // const block = ref.current.getBoundingClientRect();
        // const dw = block.x + block.width - getViewportWidth();
        // console.log(dw)
        // if (dw > 0) {
        //     const item = ref.current.closest('.transform-item');
        //     item.style.width = item.getBoundingClientRect().width - dw + 'px';
        // }
    }, [image]);

    return (
        <div className={'image-editor'} ref={ref}></div>
    );
}