import {triggerEvent} from "helpers/events";
import {setActionData} from "./config";
import {getSettings} from "./helpers";
import {getFormData} from "../../ActionForm/helpers/FormData";
import {ElementActions, IActionElement} from "../../../ui/ObjectTransform/ObjectTransform";

function updateRequest(request) {
    if (request.method === 'DELETE') {
        request.method = 'POST';
    }
    if (request.method === 'POST') request.method = 'DELETE';
    return request;
}

class HistoryManager {
    history = [];
    current = 0;

    undo() {
        if (this.current < 0) {
            this.current = 0;
        }
        let request = this.history[this.current];
        request = updateRequest(request);
        this.history.length && triggerEvent('itemlist:request', request);
        this.current -= 1;
    }

    redo() {
        if (!this.history.length) return;
        if (this.current >= this.history.length) {
            this.current = this.history.length - 1;
        }
        let request = this.history[this.current];
        request = updateRequest(request);
        triggerEvent('itemlist:request', request);
        this.current += 1;
    }

    clear() {
        this.history = [];
    }

    add(data) {
        this.history.push(data);
    }
}

interface IRequest {
    method: string,
    url: string,
}

export interface IElement {
    data: IActionElement;
    request: IRequest;
}

interface IActions {
    elements : ElementActions;
    history : HistoryManager;
    request(element: IElement)
    update();
    delete();
    create();
    copy();
    cut();
    move();
    paste();
}

export default class Actions implements IActions{
    elements = new ElementActions();
    history = new HistoryManager();

    request(element: IElement) {

    }

    create(item='') {
        let data = setActionData(item);
        if (!data) {
            let type = item;
            let initialData = {};
            let extraFields = [];

            // window.modals.open("element-form") getFormData({initialData, extraFields, method:'POST', element: {data:{type}}}));
            return [];
        }
        if (!Array.isArray(data)) {
            data = [data];
        }
        return data.map(d => ({
            method: 'POST',
            createTree: false,
            specifyParent: true,
            data: {
                type: item,
                ...d,
            }}));
    }

    update(item='') {
        if (!item) {
            triggerEvent('element-form', getFormData({method:'PATCH', element: this.focused}));
            return [];
        }
        return [{
            method: 'PATCH',
            specifyElement: true,
            data: {
                ...getSettings(item, this.focused.data)
            }
        }];
    }

    baseAction(type, name) {
        Actions.history.forEach(hs => hs.element.html.classList.remove(hs.className));
        Actions.history = [];
        let elements = [...actionElements];
        if (!elements.length) elements = [actionElement];
        elements.forEach(el => {
            el.html.classList.add(name);
            Actions.history.push({
                className: name,
                type: type,
                element: el,
            })
        });
        clearElements();
        return [];
    }

    copy() {
       return Actions.baseAction('copy', 'copied');
    }

    move() {

    }

    cut() {
        return Actions.baseAction('cut', 'cutted');
    }

    paste() {
        let historyData = Actions.history;
        if (!historyData) return [];
        let action = actionElement;

        let actionData = structuredClone(action.data);

        let request = [];
        historyData.forEach(hs => {
            let item = {
                ...hs.element.data,
                parent: action.id,
            };
            request.push({
                data: item,
            });
            request[request.length - 1].method = 'POST';
            if (hs.type === 'cut') request.push(...Actions.delete([hs.element]));
        });
        historyData.forEach(hs => hs.element.html.classList.remove(hs.className));
        return request;
    }

    delete() {
        const f = el => ({data: structuredClone(el.data), method: 'DELETE', element: el.html});
        let data = elements.map(el => f(el));
        if (!data.length) data = [f(actionElement)];
        if (elements.length) return data;
        clearElements();
        return new Promise((resolve) => {
            triggerEvent('user-prompt', {title: "Подтвердить удаление", button: 'ок', submitCallback: (submit) => {
                if (!!submit) resolve(data);
                else resolve([]);
            }});
        });
    }
}

declare global {
    interface Window {
        actions: Actions;
    }
}

