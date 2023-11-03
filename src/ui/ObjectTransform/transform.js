import {initContainerDimensions} from "./helpers";
import {triggerEvent} from "../../helpers/events";
import {getElementID} from "../../modules/ActionManager/components/helpers";

let item = null;
let container = null;
let btn = null;
let transform = null;

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
    if (width) item.style.width = Math.min(width / win.width * 100, 100) + "%";
    if (offset) item.style.left = Math.min(offset / win.width * 100, 100) + "%";
}

function moveAt(event, shiftX, shiftY) {
    let rect = btn.getBoundingClientRect();
    let block = item.getBoundingClientRect();
    let win = item.closest(".transform-container").getBoundingClientRect();

    let btnX = rect.left + rect.width / 2 + shiftX;
    let btnY = rect.top + rect.height / 2 + shiftY;

    let deltaX = event.clientX - btnX;
    let deltaY = event.clientY - btnY;
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return false;
    
    if (transform.type === "resize") {
        if (transform.dir === 'resize-left') deltaX *= -1;
        let offsetL = item.offsetLeft;
        let width = block.width + deltaX;
        let height = block.height + deltaY;

        if (transform.dir === 'resize-right' && width + offsetL > win.width) width = block.width;
        width = Math.max(50, width);
        height = Math.max(20, height);

        if (transform.dir === 'resize-left') {
            offsetL = offsetL + (block.width - width);
            if (offsetL <= 0) width = block.width;
            offsetL = Math.max(0, offsetL);
        }
        try {
            item.querySelector('.transform-container').style.height = height + 'px';
            item.querySelector('.transform-container').setAttribute('data-height', height);
            // initContainerDimensions({container:item.querySelector('.transform-container'), item});
        } catch (e) {}
        setItemProps(offsetL, width);
    } else {
        let px = item.offsetLeft + deltaX;
        let py = item.offsetTop + deltaY;
        if (event.ctrlKey) {
            if (checkNears(px, py - deltaY)[0]) px = item.offsetLeft;
            if (checkNears(px - deltaX, py)[1]) py = item.offsetTop;
        }
        if (px < 0) px = 0;
        if (py < 0) py = 0;
        if (px + block.width > win.width) px = win.width - block.width;

        item.style.top = py + "px";
        setItemProps(px, block.width);
    }
    initContainerDimensions({container, item});
    mouseMoved = true;
    return true;
}

export function setItemTransform(event, type, _item, _btn) {
    transform = {type, dir:""};
    if (type !== "move") transform = {type:"resize", dir:type};
    container = _item.closest(".transform-container");
    item = _item;
    btn = _btn;

    initContainerDimensions({container, item});
    document.body.style.userSelect = 'none';

    let shiftX = event.clientX - (btn.getBoundingClientRect().left + btn.getBoundingClientRect().width / 2);
    let shiftY = event.clientY - (btn.getBoundingClientRect().top + btn.getBoundingClientRect().height / 2);

    function onMouseMove(event) {
        let moved = moveAt(event, shiftX, shiftY);
        if (!moved) return;
        if (!item.classList.contains("transformed")) item.classList.add("transformed");
        if (transform.type === "move") {
            if (item.style.position !== 'fixed') item.style.position = 'absolute';
        }
    }

    function onMouseUp() {
        document.body.style.userSelect = 'auto';
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        if (!mouseMoved) return;

        setTimeout(() => {
            item.classList.remove("transformed");
        }, 200)

        mouseMoved = false;
        if (container.classList.contains('viewport-container')) return;
        let parent = getElementID(item.closest('.item'));

        let request = [{
            data: {
                id: getElementID(item.querySelector('.item')),
                position: item.style.position || 'initial',
                height: item.getBoundingClientRect().height || "0",
                width: item.style.width.replace("%", "") || "0",
                top: item.style.top.replace("px", "") || "0",
                left: item.style.left.replace("%", "") || "0",
                container_width: item.querySelector('.transform-container').getBoundingClientRect().width || "0",
            },
            method: 'PATCH',
        }, {
            data: {
                id: parent,
                container_width: container.getBoundingClientRect().width || "0",
            },
            method: 'PATCH',
        }];
        console.log(request)
        triggerEvent('action:callback', request);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
}