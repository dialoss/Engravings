
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
    const dataWidth = +container.getAttribute('data-width').replace('px','') || container.getBoundingClientRect().width;
    const ratio = (container.getBoundingClientRect().width / dataWidth) || 1;
    // console.log(container, container.getBoundingClientRect().width)
    for (const block of getFirstItems(container)) {
        const childCont = block.querySelector('.transform-container');
        const dataHeight = +childCont.getAttribute('data-height').replace('px','');
        childCont.style.minHeight = dataHeight * ratio + 'px';
        // console.log(block, block.s)
        if (isResizable(container) && block.style.position === 'absolute' && !block.classList.contains('transformed')) {
            block.style.top = +block.getAttribute('data-top').replace('px', '') * ratio + 'px';
        }
        let rect = block.getBoundingClientRect();
        m = Math.max(m, block.offsetTop + rect.height);
    }
    // const contHeight = container.getBoundingClientRect().height;
    // let dataHeight = container.getAttribute('data-height');
    // if (+dataHeight) {
        // m = +dataHeight * ratio
        // if (isResizable(container)) m = Math.max(m, contHeight);
    // }
    // else {
        // if (!dataWidth && contHeight > 2) m = contHeight;
    // }
    return m;
}

export function initContainerDimensions({container, item, toChild}) {
    if (!container) return;
    if (container.classList.contains('viewport-container')) return;
    let contHeight = getMaxBottom(container);
    // console.log(container, contHeight)
    if (!isResizable(container) && item) {
        let itemBlock = item.getBoundingClientRect();
        let contBlock = container.getBoundingClientRect();
        if (item.offsetTop + itemBlock.height > contBlock.height)
            item.style.top = Math.max(0, contBlock.height - itemBlock.height) + 'px';
        return;
    }
    container.style.minHeight = contHeight + "px";

    // if (!toChild) {
    //     let parentContainer = container.parentElement.closest('.transform-container');
    //     parentContainer && initContainerDimensions({container: parentContainer});
    // }
    // if (item) {
    //     for (const child of getFirstItems(item.querySelector('.transform-container'))) {
    //         let childContainer = child.querySelector('.transform-container');
    //         childContainer && initContainerDimensions({container: childContainer, item, toChild: true});
    //     }
    // }
}

export function preventOnTransformClick(ref) {
    const itemTransform = ref.current.closest(".transform-item");
    if (!!itemTransform && Array.from(itemTransform.classList).slice(-1)[0] === 'transformed') {
        itemTransform.classList.remove("transformed");
        return true;
    }
    return false;
}