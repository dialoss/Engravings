//@ts-nocheck
import {triggerEvent} from "../../helpers/events";
import {getFileType} from "./api/google";

export class MediaDimensions {
    media: File;
    type: string;

    constructor(file: File) {
        this.media = file;
        this.type = getFileType(file.name);
    }

    private async image(src: string, resolve) {
        const img = new Image();
        img.onload = () => resolve({height: img.naturalHeight, width: img.naturalWidth});
        img.src = src;
    }

    private async video(src: string, resolve) {
        const video = document.createElement('video');
        video.addEventListener( "loadedmetadata", function () {
            const height = this.videoHeight;
            const width = this.videoWidth;
            resolve({height, width});
        }, false);
        video.src = src;
    }

    get() : Promise<{width: number, height: number}> {
        return new Promise((resolve, reject) => {
            const mediaSource = fileToMedia(this.media);
            switch (this.type) {
                case 'image':
                    return this.image(mediaSource, resolve);
                case 'video':
                    return this.video(mediaSource, resolve);
            }
        });
    }
}

export function fileToMedia(file: File | ArrayBuffer) : string {
    let blob = new Blob([file], { type: file.type});
    return window.URL.createObjectURL( blob );
}

export function selectItems() {
    const itemsAll = window.filemanager.GetCurrentFolder().GetEntries();
    const selected = window.filemanager.GetSelectedItemIDs()
        .map(id => itemsAll.find(it => it.id === id));
    if (window.filemanager.selectItems) {
        window.filemanager.selectItems(selected.map(f => serializeFile({...f, type: f.filetype})));
        window.filemanager.selectItems = null;
    } else {
        for (const f of selected.map(f => fileToItem({...f, type: f.filetype}))) {
            window.actions.request(f);
        }
    }
    window.filemanager.ClearSelectedItems();
    triggerEvent("filemanager-window:toggle", {isOpened: false});
}