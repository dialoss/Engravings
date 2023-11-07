import store from "store";
import {getElementFromCursor} from "../../../helpers/events";
import {actions} from "../../ItemList/store/reducers";
import {getViewportWidth} from "../../../ui/helpers/viewport";

const emptyElement = {
    id: -1,
    data: {},
    type: "",
    html: null,
    display_pos: -1,
}

export let prevElement = emptyElement;
export let actionElement = emptyElement;
export let actionElements = [];

export function getElementID(element) {
    return element ? +element.getAttribute('data-id') : '';
}

function setElements() {
    if (actionElements.find(el => el.id === actionElement.id)) {
        actionElement.html.classList.remove('selected');
        actionElements = actionElements.filter(el => el.id !== actionElement.id);
    } else {
        actionElement.html.classList.add('selected');
        actionElements.push(actionElement);
    }
}

export function setUnselected() {
    actionElements.forEach(el => {
        el.html.classList.remove('selected');
    });
    actionElements = [];
}

function getElement(event, depth=null) {
    let element = getElementFromCursor(event, 'item');
    if (depth !== null) element = element.closest('.item.depth-0');

    if (!element) return null;
    let id = +getElementID(element);
    return {
        id,
        html: element,
    }
}

export function setActionElement(event) {
    prevElement = actionElement;
    let el = getElement(event);
    let display_pos = getClickPosition(event);

    if (el || event.ctrlKey) {
        if (event.ctrlKey && !el) el = getElement({clientX: getViewportWidth() / 2, clientY: event.clientY}, 0);
        let parentElement = el.html.closest('.item.depth-0');
        if (parentElement === el.html) el.parent_0 = '';
        else el.parent_0 = getElementID(parentElement);
        el.parent = getElementID(el.html.closest('.item.depth-' + (el.html.getAttribute('data-depth') - 1))) || el.parent_0;
        el.display_pos = display_pos;
        el.data = store.getState().elements.itemsAll[el.id];
        actionElement = el;
        event.ctrlKey && setElements();
    } else {
        actionElement = {
            id: '',
            parent: '',
            parent_0: '',
            type: 'screen',
            display_pos: display_pos,
            data: {display_pos: display_pos}
        }
    }
    store.dispatch(actions.setActionElement({actionElement: {...actionElement, html:''}}));
    console.log(actionElement, actionElements);
}

function getClickPosition(event) {
    let pos = event.pageY;
    let curPos = 0;
    for (const item of document.querySelectorAll(".item.depth-0")) {
        let block = item.getBoundingClientRect();
        let b = block.top + block.height + window.scrollY;
        if (curPos === 0 && pos <= b) {
            return 0;
        }
        curPos += 1;
        if (pos > b) continue;
        pos = curPos - 1;
        return pos;
    }
    if (curPos === 0) pos = 0;
    else pos = curPos + 1;
    return pos;
}