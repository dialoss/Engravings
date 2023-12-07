

interface Image {
    url: string,
    media_width: number,
    media_height: number,
}

export function getCompressedImage(img: Image, targetWidth: number) : string {
    if (!img.url) return '';
    if (img.media_width) {
        const w = img.media_width;
        const r = w / img.media_height;
        let new_w = w;
        // if (item.width === '100%' && document.querySelector(`.item.depth-1[data-id="${item.id}"]`))
        //     targetWidth = Math.max(1000, targetWidth);
        if (targetWidth) new_w = Math.min(w, targetWidth);
        const new_h = Math.floor(new_w / r);
        new_w = Math.floor(new_w);
        return `https://lh3.google.com/u/6/d/${img.url}=w${new_w}-h${new_h}`;
    }
    return `https://lh3.google.com/u/6/d/${img.url}`;
}