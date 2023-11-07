
function getFirstItems(container) {
    let items = container.querySelector('.items-wrapper');
    if (items) return items.querySelectorAll(':scope > .transform-item');
    return [];
}

export function isResizable(container) {
    return !['image', 'model', 'video', 'subscription'].includes(container.getAttribute('data-type'));
}

function getMaxBottom(container) {
    let m = 0;
    const parentWidth = +(container.getAttribute('data-width') || '').replace('px','');

    const curWidth = container.getBoundingClientRect().width;

    const ratio = (curWidth / parentWidth) || 1;
    for (const block of getFirstItems(container)) {
        if (isResizable(container) && block.style.position === 'absolute' && !block.classList.contains('transformed')) {
            block.style.top = +block.getAttribute('data-top').replace('px', '') * ratio + 'px';
        }
        let rect = block.getBoundingClientRect();
        m = Math.max(m, block.offsetTop + rect.height);
    }
    const dataHeight = +container.getAttribute('data-height').replace('px','');
    if (dataHeight && m < dataHeight &&
        !['timeline', 'base'].includes(container.getAttribute('data-type'))) m = dataHeight * ratio;

    return m;
}
let counter = 0;
export function initContainerDimensions({container, item, toChild, resize}) {
    if (!container) return;
    if (container.classList.contains('viewport-container')) return;
    let contHeight = getMaxBottom(container, resize);
    console.log(counter++)
    if (!isResizable(container) && item) {
        let itemBlock = item.getBoundingClientRect();
        let contBlock = container.getBoundingClientRect();
        if (item.offsetTop + itemBlock.height > contBlock.height)
            item.style.top = Math.max(0, contBlock.height - itemBlock.height) + 'px';
        return;
    }
    container.style.minHeight = contHeight + "px";

    if (!resize) {
        let parentContainer = container.parentElement.closest('.transform-container');
        parentContainer && initContainerDimensions({container: parentContainer});
    }
}

export function preventOnTransformClick(ref) {
    const itemTransform = ref.current.closest(".transform-item");
    if (!!itemTransform && Array.from(itemTransform.classList).slice(-1)[0] === 'transformed') {
        itemTransform.classList.remove("transformed");
        return true;
    }
    return false;
}