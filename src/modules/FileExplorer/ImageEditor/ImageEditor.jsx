import React, {useEffect, useState} from 'react';
import "./ImageEditor.scss";
const { TABS, TOOLS } = window.FilerobotImageEditor;

export function ImageEditor({image}) {
    useEffect(()=>{
        if (!image) return;
        console.log(image)
        const config = {
            source: image,
            onSave: (img, designState) => {
                console.log(img)
                // console.log(img.imageCanvas.toDataURL())
                // window.filemanager.settings.oninitupload(null, {folder: null, img});
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
    },[image])

    return (<div className={'image-editor'}></div>);
}