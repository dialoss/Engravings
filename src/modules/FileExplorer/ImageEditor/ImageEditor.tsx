import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./ImageEditor.scss";
import {doc} from "firebase/firestore";
import {fetchRequest} from "../../../api/requests";
import {fileToMedia} from "../helpers";
const { TABS, TOOLS } = window.FilerobotImageEditor;

export function ImageEditor() {
    const [image, setImage] = useState({});

    const openEditor = (folder, entry) => {
        if (entry.filetype !== 'image') return;
        setImage({meta: entry});
        console.log(entry)
        fetchRequest(entry.url).then(res => res.arrayBuffer()).then(file => {
            const url = fileToMedia(file);
            let img = new Image();
            img.src = url;
            setImage({image:img, folder: window.filemanager.GetCurrentFolder(), meta: entry});
        });
    }

    useEffect(() => {
        window.filemanager.addEventListener('open_file', openEditor);
    }, []);

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
            closeAfterSave: true,
            defaultSavedImageName: image.meta.name,
            defaultSavedImageQuality: 1,
            onSave: async (img, designState) => {
                let blobBin = atob(img.imageBase64.split(',')[1]);
                let array = [];
                for (let i = 0; i < blobBin.length; i++) {
                    array.push(blobBin.charCodeAt(i));
                }
                const file = new Blob([new Uint8Array(array)], {type: img.mimeType});
                file.name = img.fullName;
                await uploadFile({file, folder:image.folder.GetPathIDs().slice(-1)[0]});
                document.querySelector('.filemanager__button.refresh').click();
                },
            annotationsCommon: {
                // fill: '#000000',
                stroke: '#b51e1e',
            },
            Text: { text: 'Привет' },
            Rotate: { angle: 90, componentType: 'slider' },
            tabsIds: [TABS.ADJUST,TABS.ANNOTATE, TABS.FINETUNE, TABS.RESIZE,],
            defaultTabId: TABS.ANNOTATE,
            defaultToolId: TOOLS.PEN,
            Pen: {
                strokeWidth: 100,
                linecap: 'square',
                color: '#b51e1e'
            }
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