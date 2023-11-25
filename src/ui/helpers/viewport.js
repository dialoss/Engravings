export function getViewportSize() {
    return [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)];
}

export function getViewportWidth() {
    return getViewportSize()[0];
}

export function getCorrectedPosition(element, pos) {
    let block = element.getBoundingClientRect();
    let [posX, posY] = pos;
    let bRight = posX + block.width;
    let bBottom = posY + block.height;

    const [vw, vh] = getViewportSize();
    let side = 'right'
    if (posX + block.width > vw) {
        posX -= block.width;
    }
    if (posX + block.width + 100 > vw) {
        side = 'left';
    }
    if (bBottom + 10 > vh) posY -= block.height;

    return [posX, posY, side];
}