export function getCompressedImage(item, targetWidth) {
    if (!item.url) return '';
    if (item.media_width) {
        const w = item.media_width;
        const r = w / item.media_height;
        let new_w = w;
        if (item.width === '100%' && document.querySelector(`.item.depth-1[data-id="${item.id}"]`))
            targetWidth = Math.max(1000, targetWidth);
        if (targetWidth) new_w = Math.min(w, targetWidth);
        const new_h = Math.floor(new_w / r);
        new_w = Math.floor(new_w);
        return `https://lh3.google.com/u/6/d/${item.url}=w${new_w}-h${new_h}`;
    }
    return `https://lh3.google.com/u/6/d/${item.url}`;
}