import React, {useEffect, useState} from 'react';

export function ImageEditor() {
    useEffect(()=>{
        const config = {
            source: 'https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg',
            onSave: (editedImageObject, designState) => console.log('saved', editedImageObject, designState),
            annotationsCommon: {
                fill: '#ff0000'
            },
            Text: { text: 'Привет' },
            Rotate: { angle: 90, componentType: 'slider' },
            tabsIds: [window.FilerobotImageEditor.TABS.ADJUST,window.FilerobotImageEditor.TABS.ANNOTATE,window.FilerobotImageEditor.TABS.WATERMARK],
            defaultTabId: window.FilerobotImageEditor.TABS.ANNOTATE,
            defaultToolId: window.FilerobotImageEditor.TOOLS.TEXT,
        };

        const filerobotImageEditor = new window.FilerobotImageEditor(
            document.querySelector('#editor_container'),
            config
        );

        // window.FilerobotImageEditor.render({
        //     onClose: (closingReason) => {
        //         console.log('Closing reason', closingReason);
        //         window.FilerobotImageEditor.terminate();
        //     }
        // });
    },[])

    return (<div id={'editor_container'}></div>);
}