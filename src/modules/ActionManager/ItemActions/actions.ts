import {triggerEvent} from "helpers/events";
import {setActionData} from "./config";
import {getSettings} from "./helpers";
import {childItemsTree, createItemsTree} from "../../ItemList/helpers";
import {getFormData} from "../../ActionForm/helpers/FormData";

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
//
// window.addEventListener('keydown', e => {
// if e.target === null
//     if (e.ctrlKey) {
//         switch (e.code) {
//             case 'KeyZ':
//                 return manager.undo();
//             case 'KeyY':
//                 return manager.redo();
//             case 'KeyC':
//                 return Actions.copy();
//             case 'KeyX':
//                 return Actions.cut();
//             case 'KeyV':
//                 return Actions.action(Actions.paste());
//             case 'KeyQ':
//                 return manager.clear();
//         }
//     }
//     if (e.key === 'Delete') {
//         Actions.action(Actions.delete());
//     }
// })


interface IRequest {
    method: string,
    url: string,
}

interface IElement {
    data: object;
    request?: IRequest;
}

declare global {
    interface Window {
        actions: IActions;
    }
}

interface IActions {
    focused : IElement;
    selected : IElement[];
    history : HistoryManager;
    request(elements: IElement[])
    update();
    delete();
    create();
    copy();
    move();
    paste();
}

export default class Actions implements IActions{
    focused = {data: {}};
    selected = [];
    history = new HistoryManager();

    request(elements: IElement[]) {
        if (!sendData.tab && !actionElement.data.tab) sendData.tab = window.currentTab;
        if (request.method === 'POST' && request.createTree) sendData = childItemsTree(sendData)

        let prevData = {};
        for (const f in sendData) {
            prevData[f] = actionElement.data[f] || sendData[f];
            prevData.page = preparePage(prevData.page);
        }
    }

    create(item='') {
        let data = setActionData(item);
        if (!data) {
            let type = item;
            let initialData = {};
            let extraFields = [];

            triggerEvent('element-form', getFormData({initialData, extraFields, method:'POST', element: {data:{type}}}));
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
                display_pos: actionElement.display_pos,
                ...d,
            }}));
    }

    update(item='') {
        if (!actionElement.id) return [];
        if (!item) {
            triggerEvent('element-form', getFormData({method:'PATCH', element: actionElement}));
            return [];
        }
        return [{
            method: 'PATCH',
            specifyElement: true,
            data: {
                ...getSettings(item, actionElement.data)
            }
        }];
    }

    baseAction(type, name) {
        // console.log(Actions.history)
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
                display_pos: actionData.display_pos,
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

window.actions = new Actions();