
function getVideoDimensions(url){
    return new Promise(resolve => {
        const video = document.createElement('video');
        video.addEventListener( "loadedmetadata", function () {
            const height = this.videoHeight;
            const width = this.videoWidth;
            resolve({height, width});
        }, false);
        video.src = url;
    });
}
function getImageDimensions(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({height: img.naturalHeight, width: img.naturalWidth});
        img.onerror = (err) => reject(err);
        img.src = url;
    });
}

export async function fileToItem(data) {
    const url = "https://drive.google.com/uc?id=" + data.id;
    let height = '';
    let width = '';
    if (['image'].includes(data.type)) await getImageDimensions(url).then(d => ({height, width} = d))
    if (['video'].includes(data.type)) await getVideoDimensions(url).then(d => ({height, width} = d))
    if (['model'].includes(data.type)) ({height, width} = {height: 300, width: 300});
    return {
        data: {
            width: data.type === 'model' ? '50%' : 'auto',
            show_shadow: data.type !== 'file',
            container_width: width + 'px',
            height: height + 'px',
            urn: data.urn,
            type: data.type,
            filename: data.name,
            url,
        },
        specifyParent: true,
        method: 'POST',
    }
}