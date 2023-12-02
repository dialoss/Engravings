import {initContainerDimensions, isResizable} from "./helpers";
import {triggerEvent} from "../../helpers/events";
import {getElementID} from "../../modules/ActionManager/components/helpers";
import {Axis} from "./config";

let item = null;
let container = null;
let btn = null;
let transform = null;
let deltaX = 0;
let deltaY = 0;

function checkNears(px, py) {
    let curBlock = item.getBoundingClientRect();
    let items = container.children[0].children;
    let ch = curBlock.height;
    let ox = false;
    let oy = false;
    for (let j = 0; j < items.length; j++) {
        if (items[j] === item) continue;
        let cx1 = px;
        let cy1 = py;
        let cx2 = px + curBlock.width;
        let cy2 = py + curBlock.height;

        let nearBlock = items[j].getBoundingClientRect();
        let nx1 = items[j].offsetLeft;
        let ny1 = items[j].offsetTop;
        let nx2 = nx1 + nearBlock.width;
        let ny2 = ny1 + nearBlock.height;
        let nh = nearBlock.height;
        if (cx1 > nx1) {
            cx1 = [nx1, nx1 = cx1][0];
            cx2 = [nx2, nx2 = cx2][0];
            cy1 = [ny1, ny1 = cy1][0];
            cy2 = [ny2, ny2 = cy2][0];
        }
        if (cx2 - nx1 >= 0 && cy2 - ny1 >= 0 && cy2 - ny1 <= ch + nh) {
            if (cx2 - nx1 > 0) ox = true;
            if (cy2 - ny1 > 0 && cy2 - ny1 < ch + nh) oy = true;
        }
        if (cx2 - nx1 >= 0 && ny2 - cy1 >= 0 && ny2 - cy1 <= ch + nh) {
            if (cx2 - nx1 > 0) ox = true;
            if (ny2 - cy1 > 0 && ny2 - cy1 < ch + nh) oy = true;
        }
    }
    return [ox, oy];
}

let mouseMoved = false;

export function setItemProps(offset, width) {
    let win = container.getBoundingClientRect();
    if (width) item.style.width = Math.max(0, Math.min(width / win.width * 100, 100)) + "%";
    if (offset) {
        item.style.left = Math.max(0, Math.min(offset / win.width * 100, 100)) + "%";
        item.style.right = 'auto';
        item.style.bottom = 'auto';
    }
}

function moveAt(event, shiftX, shiftY) {
    let rect = btn.getBoundingClientRect();

    let btnX = rect.left + rect.width / 2 + shiftX;
    let btnY = rect.top + rect.height / 2 + shiftY;

    deltaX = event.clientX - btnX;
    deltaY = event.clientY - btnY;
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return false;
    mouseMoved = true;
    return true;
}

export function transformItem({item, event}) {
    if (!item.classList.contains("transformed")) item.classList.add("transformed");
    if (transform.type === "move") {
        if (item.style.position !== 'fixed') item.style.position = 'absolute';
    }

    let block = item.getBoundingClientRect();
    let win = item.closest(".transform-container").getBoundingClientRect();

    if (transform.type === "resize") {
        deltaX *= transform.dir[0];
        deltaY *= transform.dir[1];
        let offsetL = item.offsetLeft;
        let width = block.width + deltaX;
        let height = block.height + deltaY;

        if (transform.dir[0] > 0 && width + offsetL > win.width) width = block.width;
        width = Math.max(50, width);
        height = Math.max(20, height);

        if (transform.dir[0] < 0) {
            offsetL = offsetL + (block.width - width);
            if (offsetL <= 0) width = block.width;
            offsetL = Math.max(0, offsetL);
        }
        try {
            const cont = item.querySelector('.transform-container');
            cont.style.minHeight = height + 'px';
            item.style.minHeight = height + 'px'
        } catch (e) {}
        setItemProps(offsetL, width);
    } else {
        let px = item.offsetLeft + deltaX;
        let py = item.offsetTop + deltaY;
        if (event.ctrlKey) {
            if (checkNears(px, py - deltaY)[0]) px = item.offsetLeft;
            if (checkNears(px - deltaX, py)[1]) py = item.offsetTop;
        }
        if (py < 0) py = 0;
        if (px < 0) px = 0;
        if (px + block.width > win.width) px = win.width - block.width;

        item.style.top = py + "px";
        setItemProps(px, block.width);
    }
    initContainerDimensions({container, item});
}

export function setItemTransform(event, type, _item, _btn, config) {
    transform = {type, dir:""};
    if (type !== "move") transform = {type:"resize", dir:Axis[type]};
    container = _item.closest(".transform-container");
    item = _item;
    btn = _btn;

    item.style.userSelect = 'none';

    let shiftX = event.clientX - (btn.getBoundingClientRect().left + btn.getBoundingClientRect().width / 2);
    let shiftY = event.clientY - (btn.getBoundingClientRect().top + btn.getBoundingClientRect().height / 2);

    function onMouseMove(event) {
        let moved = moveAt(event, shiftX, shiftY);
        if (!moved) return;
        config.onSwipeStart({event, item});
    }

    function onMouseUp() {
        item.style.userSelect = 'auto';
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        if (!mouseMoved) return;

        setTimeout(() => {
            item.classList.remove("transformed");
        }, 200)

        mouseMoved = false;
        config.onSwipeEnd({item});
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}

export function getTransformData({item}) {
    let top = item.offsetTop / container.getBoundingClientRect().height * 100 + '%';
    if (isResizable(container)) top = item.offsetTop + 'px';
    item.setAttribute('data-top', item.style.top);
    let parent = getElementID(item.closest('.item'));

    let request = [{
        data: {
            id: getElementID(item.querySelector('.item')),
            position: item.style.position || 'initial',
            height: item.querySelector('.transform-container').getBoundingClientRect().height + 'px' || "0",
            width: item.style.width || "0",
            top,
            left: item.style.left || "0",
            container_width: item.querySelector('.transform-container').getBoundingClientRect().width || 0,
        },
        method: 'PATCH',
    },
        {
            data: {
                id: parent,
                container_width: container.getBoundingClientRect().width || 0,
            },
            method: 'PATCH',
            skipHistory: true,
        }
    ];
    triggerEvent('action:callback', request);
}