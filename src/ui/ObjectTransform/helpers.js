
function getFirstItems(container) {
    return container.querySelector('.items-wrapper').querySelectorAll(':scope > .transform-item');
}

function isResizable(container) {
    return !['image', 'model', 'video', 'subscription'].includes(container.getAttribute('data-type'));
}

function getMaxBottom(container) {
    let m = 0;
    const dataWidth = +container.getAttribute('data-width');
    const ratio = (container.getBoundingClientRect().width / dataWidth) || 1;

    for (const block of getFirstItems(container)) {
        if (block.style.position === 'absolute' && !block.classList.contains('transformed')) {
            block.style.top = +block.getAttribute('data-top') * ratio + 'px';
        }
        let rect = block.getBoundingClientRect();
        m = Math.max(m, block.offsetTop + rect.height);
    }
    let dataHeight = container.getAttribute('data-height');
    if (+dataHeight) m = +dataHeight * ratio;
    const contHeight = container.getBoundingClientRect().height;
    if (!dataWidth && contHeight) m = contHeight;

    if (m === 0) {
        let itemsHeight = 0;
        if (container.children[1]) itemsHeight = container.children[1].getBoundingClientRect().height;
        m = itemsHeight;
    }
    // console.log(container, dataHeight, m)
    return m;
}

export function initContainerDimensions({container, item, toChild}) {
    if (!container) return;
    if (container.classList.contains('viewport-container')) return;
    let contHeight = getMaxBottom(container);

    // if (container.getAttribute('data-height') === 'fixed') {
    //     if (container.children[1]) contHeight = container.children[1].getBoundingClientRect().height;
    // }
    if (!isResizable(container) && item) {
        let itemBlock = item.getBoundingClientRect();
        let contBlock = container.getBoundingClientRect();
        if (item.offsetTop + itemBlock.height > contBlock.height)
            item.style.top = Math.max(0, contBlock.height - itemBlock.height) + 'px';
        return;
    }
    container.style.height = contHeight + "px";
    // console.log(container, container.style.height)

    if (!toChild) {
        let parentContainer = container.parentElement.closest('.transform-container');
        parentContainer && initContainerDimensions({container: parentContainer});
    }
    for (const child of getFirstItems(container)) {
        let childContainer = child.querySelector('.transform-container');
        // console.log(child)
        // childContainer && initContainerDimensions({container: childContainer, toChild: true});
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