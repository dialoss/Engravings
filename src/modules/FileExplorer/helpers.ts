//@ts-nocheck
import {StorageFile} from "./api/google";

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
        .map(id => itemsAll.find(it => it.id === id)).map(f => fileToItem(f));
    if (window.filemanager.selectItems) {
        window.filemanager.selectItems(selected);
        window.filemanager.selectItems = null;
    } else {
        window.actions.request('POST', selected);
    }
    window.filemanager.ClearSelectedItems();
    window.modals.close("filemanager");
}

export function fileToItem(file: StorageFile) {
    return {
        type: getFileType(file.name),
        data: {
            filename: file.name,
            url: file.id,
            ...file.props,
        },
        style: {
            aspectRatio: "1 / 1",

        }
    }
}

const types = {
    'image': ['png', 'jpeg', 'jpg', 'webp', 'gif', 'image'],
    'model': ['sldprt', 'sld', 'sldw', 'sldasm', 'sdas', 'glb', 'gltf'],
    'video': ['mp4', 'mkv', 'matroska', 'avi', 'mov', 'video'],
    'folder': ['folder'],
};

export function getFileType(filename: string) : string {
    for (const type in types) {
        for (const ext of types[type]) {
            if (filename.toLowerCase().includes(ext)) return type;
        }
    }
    return "file";
}