import {getMediaType} from "./api/google";

function getVideoDimensions(file){
    return new Promise(resolve => {
        const video = document.createElement('video');
        video.addEventListener( "loadedmetadata", function () {
            const height = this.videoHeight;
            const width = this.videoWidth;
            resolve({height, width});
        }, false);
        video.src = fileToMedia(file);
    });
}

function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({height: img.naturalHeight, width: img.naturalWidth});
        img.onerror = (err) => reject(err);
        img.src = fileToMedia(file);
    });
}

export async function getMediaDimensions(file) {
    let d = {width: 100, height: 100};
    switch (getMediaType(file.name)) {
        case 'image':
            await getImageDimensions(file).then(dim => d = dim);
            break;
        case 'video':
            await getVideoDimensions(file).then(dim => d = dim);
    }
    return d;
}

export function fileToMedia(file) {
    let blob = new Blob([file], { type: file.type});
    return window.URL.createObjectURL( blob );
}

export function fileToItem(data) {
    return {
        data: {
            width: data.type === 'model' ? '50%' : 'auto',
            show_shadow: data.type !== 'file',
            height: data.height + 'px',
            container_width: data.width,
            media_height: data.height,
            media_width: data.width,
            urn: data.urn,
            type: data.type,
            filename: data.name,
            url: data.id,
        },
        specifyParent: true,
        method: 'POST',
    }
}