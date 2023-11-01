import data from "@emoji-mart/data";

function getMaxBottom(container, resize) {
    let m = 0;
    for (const block of container.querySelectorAll(".transform-item")) {
        if ((resize || !block.attributes['inited']) && block.style.position === 'absolute') {
            block.style.top = block.offsetTop * container.getBoundingClientRect().width /
                +container.getAttribute('data-width') + 'px';
            block.setAttribute('inited', true);
        }
        let rect = block.getBoundingClientRect();
        m = Math.max(m, block.offsetTop + rect.height);
    }
    let dataHeight = container.getAttribute('data-height');
    if (m === 0) {
        if (dataHeight !== 'auto') m = +dataHeight;
        if (dataHeight === 'fixed') m = container.querySelector(':scope:nth-child(1)').getBoundingClientRect().height;
    }
    // console.log(m)
    container.setAttribute('data-width', container.getBoundingClientRect().width);
    return m;
}

export function initContainerDimensions({container, item, resize, parent}) {
    if (!container) return;
    if (container.classList.contains('viewport-container')) return;
    if (container.getAttribute('data-height') === 'fixed' && item) {
        // let itemBlock = item.getBoundingClientRect();
        // let contBlock = container.getBoundingClientRect();
        // if (item.offsetTop + itemBlock.height > contBlock.height)
        //     item.style.top = contBlock.height - itemBlock.height + 'px';
    }
    let contHeight = getMaxBottom(container, resize);
    container.style.height = contHeight + "px";

    if (!resize && item) {
        if (!parent) {
            let parentContainer = container.closest('.item.depth-0').querySelector('.transform-container');
            initContainerDimensions({container: parentContainer, resize: false, parent: true});
        }
        let childContainer = item.querySelector('.transform-container');
        if (!childContainer) return;
        initContainerDimensions({container: childContainer, resize: false});
        for (const childItem of childContainer.querySelectorAll('.transform-item')) {
            initContainerDimensions({container: childContainer, item: childItem, resize: false})
        }
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