//@ts-nocheck
import {initContainerDimensions, isResizable} from "./helpers";
import {triggerEvent} from "../../helpers/events";
import {Axis} from "./config";

let item = null;
let container = null;
let btn = null;
let transform = null;
let deltaX = 0;
let deltaY = 0;

function getTop(elem) {
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let top = box.top +  scrollTop - clientTop;
    return Math.round(top);
}

function getLeft(elem) {
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;

    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    let left = box.left + scrollLeft - clientLeft;
    return Math.round(left);
}

export function offsetTop(item, container) {
    console.log(getTop(container))
    console.log(getTop(item))

    return getTop(item) - getTop(container);
}

function offsetLeft(item, container) {
    return getLeft(item) - getLeft(container);
}

function checkNears(px, py) {
    let curBlock = item.getBoundingClientRect();
    let items = container.querySelector('.items-wrapper').children;
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
    if (transform.type === 'move') item.style.position = "absolute";

    let block = item.getBoundingClientRect();
    let win = container.getBoundingClientRect();

    if (transform.type === "resize") {
        deltaX *= transform.dir[0];
        deltaY *= transform.dir[1];
        let offsetL = offsetLeft(item, container);
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
        item.style.aspectRatio = width / height;
        setItemProps(offsetL, width);
    } else {
        let offsetL = item.offsetLeft;
        let offsetT = item.offsetTop;
        let px = offsetL + deltaX;
        let py = offsetT + deltaY;
        if (event.ctrlKey) {
            if (checkNears(px, py - deltaY)[0]) px = offsetL;
            if (checkNears(px - deltaX, py)[1]) py = offsetT;
        }
        if (py < 0) py = 0;
        if (px < 0) px = 0;
        if (px + block.width > win.width) px = win.width - block.width;

        item.style.top = py + "px";
        setItemProps(px, block.width);
    }
    initContainerDimensions(item);
}

export function setItemTransform(event, type, _item, _btn, config) {
    transform = {type, dir:""};
    if (type !== "move") transform = {type:"resize", dir:Axis[type]};
    container = _item.parentElement.closest(".transform-item");
    item = _item;
    btn = _btn;

    window.actions.elements.transformed = item;
    item.style.userSelect = 'none';

    console.log(offsetTop(item, container));

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
        window.actions.elements.transformed = null;
        console.log(window.actions.elements)
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
    let top = item.style.top;

    window.actions.request([window.actions.prepareRequest('PATCH', undefined, {style: {
        position: item.style.position,
        aspectRatio: item.style.aspectRatio,
        width: item.style.width || "0",
        top,
        left: item.style.left || "0",
    }})]);
}