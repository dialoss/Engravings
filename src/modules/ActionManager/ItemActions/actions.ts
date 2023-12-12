//@ts-nocheck
import {triggerEvent} from "helpers/events";
import {ActionData} from "./config";
import "./events.ts";
import {getFormData} from "../../ActionForm/helpers/FormData";
import {ElementActions, emptyItem, ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";
import {ItemlistManager, manager} from "../../ItemList/components/ItemListContainer";
import store from "../../../store";
import {IPage} from "../../../pages/AppRouter/store/reducers";
import {actions} from "../../ItemList/store/reducers";
import {getSettings} from "./helpers";

function updateRequest(request: IRequest) : IRequest {
    if (request.method === 'DELETE') {
        request.method = 'POST';
    }
    if (request.method === 'POST') request.method = 'DELETE';
    return request;
}

export type Intermediate = {
    type: "cut" | "copy";
    className: "cutted" | "copied";
    item: ItemElement;
}

class HistoryManager {
    intermediate: Intermediate[] = [];
    history: IRequest[] = [];
    current = 0;

    undo() {
        if (this.current < 0) {
            this.current = 0;
        }
        let request = this.history[this.current];
        request = updateRequest(request);
        this.history.length && window.actions.itemlist.request(request);
        this.current -= 1;
    }

    redo() {
        if (!this.history.length) return;
        if (this.current >= this.history.length) {
            this.current = this.history.length - 1;
        }
        let request = this.history[this.current];
        request = updateRequest(request);
        window.actions.itemlist.request(request);
        this.current += 1;
    }

    clear() {
        this.history = [];
    }

    add(request: IRequest) {
        this.history.push(request);
    }
}

export type IRequest = {
    method: "POST" | "PATCH" | "DELETE";
    endpoint: "items" | "pages";
    item: ItemElement | IPage;
}

interface IActions {
    itemlist: ItemlistManager;
    elements : ElementActions;
    history : HistoryManager;
    request(requests: IRequest[])
    update();
    delete();
    create();
    copy();
    cut();
    paste();
    prepareRequest(method: ('POST'|'DELETE'|'PATCH'),
                   data: object,
                   item: ItemElement) : IRequest;
}

export default class Actions implements IActions{
    elements = new ElementActions();
    history = new HistoryManager();
    itemlist = manager;

    request(requests: IRequest[]) {
        for (const request of requests) {
            let url = "/api/" + request.endpoint + "/";
            if (request.method !== 'POST') url += request.item.id + "/";

            console.log(request);

            this.itemlist.request(url, request);
            this.history.add(request);
        }
    }

    create(item='') {
        let data: ItemElement[] = [ActionData[item]];
        if (!data[0]) {
            window.callbacks.call("element-form", getFormData("POST", this.elements.focused));
            return [];
        }
        let parent = this.elements.focused.type !== 'page' ? this.elements.focused.id : null;
        return data.map(d => this.prepareRequest('POST', {parent, ...d}));
    }

    update(item='') {
        if (!item) {
            window.callbacks.call("element-form", getFormData('PATCH', this.elements.focused));
            return [];
        }
        return [this.prepareRequest('PATCH', undefined, getSettings(item, this.elements.focused.style))];
    }

    baseAction(type: ('copy'|'cut'), name: ('copied'|'cutted')) {
        let elements: ItemElement[] = [...this.elements.selected];
        if (!elements.length) elements = [this.elements.focused];
        elements.forEach(el => {
            this.elements.addStyle(el, name);
            this.history.intermediate.push({
                className: name,
                type: type,
                item: el,
            })
        });
        store.dispatch(actions.setField({field:"intermediate", data:this.history.intermediate}));
        return [];
    }

    copy() {
       return this.baseAction('copy', 'copied');
    }

    cut() {
        return this.baseAction('cut', 'cutted');
    }

    paste() {
        let historyData = this.history.intermediate;
        if (!historyData) return [];
        this.history.intermediate.forEach(hs => this.elements.clearStyle(hs.item, hs.className));
        this.history.intermediate = [];
        store.dispatch(actions.setField({field:"intermediate", data:[]}));

        let action = this.elements.focused;

        let requests: IRequest[] = [];
        historyData.forEach(hs => {
            let item: ItemElement = {
                ...hs.item,
                parent: action.id,
            };
            requests.push(this.prepareRequest('POST', item));
            if (hs.type === 'cut') requests.push(...this.delete([hs.item]));
        });
        historyData.forEach(hs => this.elements.clearStyle(hs.item, hs.className));
        return requests;
    }

    delete(elements: ItemElement[]=[]) {
        let force = elements.length > 0;
        if (!elements.length) elements = this.elements.selected;
        if (!elements.length) elements = [this.elements.focused];
        let data = elements.map(el => this.prepareRequest('DELETE', el));
        if (force) return data;
        window.callbacks.call("user-prompt", {title: "Подтвердить удаление", button: 'ок', submitCallback: (submit) => {
            if (!!submit) {
                this.request(data);
            }
        }});
        return [];
    }

    prepareRequest(method: ('POST'|'DELETE'|'PATCH'),
                   item: ItemElement=undefined,
                   data: object={}) : IRequest {
        if (!item) {
            item = this.elements.focused;
        }
        if (item.style && typeof item.style !== 'string') item.style = JSON.stringify(item.style);
        return {
            method,
            endpoint: "items",
            item: {
                ...item,
                ...data,
                tab: store.getState().location.tab,
                page: store.getState().location.currentPage,
            }
        };
    }
}

export class Callbacks {
    callbacks = {};
    register(name: string, callback: any) {
        console.log(this)
        this.callbacks[name] = callback;
    }
    call(name: string, data: any={}) {
        console.log('CALLBACK', name, data, this)
        if (name in this.callbacks)
            return this.callbacks[name](data);
    }
}

declare global {
    interface Window {
        actions: Actions;
        callbacks: Callbacks;
    }
}