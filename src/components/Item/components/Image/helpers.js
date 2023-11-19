export function getCompressedImage(item, targetWidth) {
    if (!item.url) return '';
    if (!item.container_width) return '';
    const w = +item['container_width'].slice(0, -2);
    const r = +item['container_width'].slice(0, -2) / +item['height'].slice(0, -2);
    let new_w = w;
    if (targetWidth) new_w = Math.min(w, targetWidth);
    const new_h = Math.floor(new_w / r);
    new_w = Math.floor(new_w);
    return `https://lh3.google.com/u/6/d/${item.url}=w${new_w}-h${new_h}`;
}