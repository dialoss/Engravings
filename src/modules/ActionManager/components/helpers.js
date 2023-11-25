import store from "store";
import {getElementByType, getElementFromCursor} from "../../../helpers/events";
import {actions} from "../../ItemList/store/reducers";
import {getViewportWidth} from "../../../ui/helpers/viewport";
import {childItemsTree, createItemsTree} from "../../ItemList/helpers";

const emptyElement = {
    id: '',
    data: {},
    type: "",
    html: null,
    display_pos: 0,
}

export let actionElement = emptyElement;
export let actionElements = [];
export function clearElements() {
    actionElements = [];
}

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
    if (depth !== null && element) element = element.closest('.item.depth-0');

    if (!element) return null;
    let id = +getElementID(element);
    return {
        id,
        html: element,
    }
}

export function setActionElement(event) {
    const modal = getElementByType(event, 'modal');
    if (modal) return;
    let el = getElement(event);
    let display_pos = getClickPosition(event);

    if (el || event.ctrlKey) {
        if (event.ctrlKey && !el) el = getElement({clientX: getViewportWidth() / 2, clientY: event.clientY}, 0);
        if (!el) return;
        let parentElement = el.html.closest('.item.depth-0');
        if (parentElement === el.html) el.parent_0 = '';
        else el.parent_0 = getElementID(parentElement);
        el.parent = getElementID(el.html.closest('.item.depth-' + (el.html.getAttribute('data-depth') - 1))) || el.parent_0;
        el.display_pos = display_pos;
        switch (el.html.getAttribute('data-itemtype')) {
            case 'content':
            {
                const itemsAll = store.getState().elements.itemsAll;
                let data = structuredClone(itemsAll[el.id]);
                if (data.parent) data = childItemsTree(data);
                el.data = data;
                break;
            }
            case 'sidebar_link':
            {
                el.data = structuredClone(store.getState().location.pages[el.id]);
                el.data.type = 'page';
            }
        }
        actionElement = el;
        event.ctrlKey && setElements();
    } else {
        const location = store.getState().location;
        let id = '';
        for (const p of Object.keys(location.pages)) {
            if (location.relativeURL === '/' + location.pages[p].path + '/') {
                id = p;
                break;
            }
        }
        actionElement = {
            id,
            parent: '',
            parent_0: '',
            type: 'page',
            display_pos: display_pos,
            data: {display_pos: display_pos, ...structuredClone(location.pages[id]), type:'page'}
        }
    }
    store.dispatch(actions.setField({field: 'actionElement', element: {...actionElement, html:''}}));
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