//@ts-nocheck


interface Image {
    url: string,
    media_width: number,
    media_height: number,
}
export const IMAGE_URL = 'https://drive.google.com/uc?id=';
// const IMAGE_URL = 'https://lh3.google.com/u/6/d/';

export function getCompressedImage(img: Image, targetWidth: number) : string {
    if (!img.url) return '';
    if (img.media_width) {
        const w = img.media_width;
        const r = w / img.media_height;
        let new_w = w;
        if (targetWidth) new_w = Math.min(w, targetWidth);
        const new_h = Math.floor(new_w / r);
        new_w = Math.floor(new_w);
        return IMAGE_URL + `${img.url}`;
    }
    return IMAGE_URL + img.url;
}