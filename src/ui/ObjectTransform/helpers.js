function getMaxBottom(container, resize) {
    let m = 0;
    for (const block of container.querySelectorAll(".transform-item")) {
        if ((resize || !block.attributes['inited']) && block.style.position === 'absolute') {
            block.style.top = block.offsetTop * container.getBoundingClientRect().width /
                +container.attributes['data-width'].value + 'px';
            block.setAttribute('inited', true);
        }
        let rect = block.getBoundingClientRect();
        m = Math.max(m, block.offsetTop + rect.height);
    }
    container.setAttribute('data-width', container.getBoundingClientRect().width);
    return m;
}

export function initContainerDimensions({container, item, resize}) {
    if (!container) return;
    if (container.getAttribute('data-height') === 'fixed' && item) {
        let itemBlock = item.getBoundingClientRect();
        let contBlock = container.getBoundingClientRect();
        if (item.offsetTop + itemBlock.height > contBlock.height)
            item.style.top = contBlock.height - itemBlock.height + 'px';
        return;
    }
    let contHeight = getMaxBottom(container, resize);
    container.style.height = contHeight + "px";
}

export function preventOnTransformClick(ref) {
    const itemTransform = ref.current.closest(".transform-item");
    if (!!itemTransform && Array.from(itemTransform.classList).slice(-1)[0] === 'transformed') {
        itemTransform.classList.remove("transformed");
        return true;
    }
    return false;
}