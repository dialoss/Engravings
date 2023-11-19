import {triggerEvent} from "helpers/events";
import {actionElement, actionElements, setUnselected} from "modules/ActionManager/components/helpers";
import {setActionData} from "./config";
import {getSettings} from "./helpers";
import {getLocation} from "../../../hooks/getLocation";
import {childItemsTree, createItemsTree} from "../../ItemList/helpers";

let hs = [];
let current = 0;

window.addEventListener('keydown', e => {
    if (!window.elementsAction && !actionElements.length) return;
    function reverseMethod(request) {
        if (request.method === 'DELETE') return 'POST';
        if (request.method === 'POST') return 'DELETE';
        return request.method;
    }
    if (e.ctrlKey) {
        switch (e.code) {
            case 'KeyZ':
            {
                if (current < 0) {
                    current = 0;
                }
                let request = hs[current];
                request.method = reverseMethod(request);
                hs.length && triggerEvent('itemlist:handle-changes', request);
                current -= 1;
                break;
            }

            case 'KeyY':
            {
                if (!hs.length) return;
                if (current >= hs.length) {
                    current = hs.length - 1;
                }
                let request = hs[current];
                request.method = reverseMethod(request);
                triggerEvent('itemlist:handle-changes', hs[current]);
                current += 1;
                break;
            }

            case 'KeyC':
                Actions.copy();
                break;
            case 'KeyX':
                Actions.cut();
                break;
            case 'KeyV':
                Actions.action(Actions.paste());
                break;
            case 'KeyQ':
                hs = [];
                break;
        }
    }
    if (e.key === 'Delete') {
        Actions.action(Actions.delete());
    }
    console.log('history',Actions.history)
    console.log('actionel', actionElements)
})

export default class Actions {
    static element = null;
    static elements = [];
    static history = [];

    static action(data) {
        Promise.resolve(data).then(resolve => {
            for (const request of resolve) {

                let sendData = request.data || {};

                if (request.specifyElement) sendData.id = actionElement.id;
                if (request.specifyParent && !('parent' in sendData)) sendData.parent = actionElement.id;

                if (request.method === "POST" && !sendData.parent && sendData.type !== 'base') {
                    sendData = {
                        display_pos: actionElement.display_pos,
                        type: 'base',
                        items: [structuredClone(sendData)],
                    }
                }

                let url = '/api/items/';
                if (request.method !== 'POST') {
                    if (!actionElement.id) request.method = 'POST';
                    else {
                        let id = sendData.id;
                        if (!id) id = actionElement.id;
                        url += id + '/';
                    }
                }

                function preparePage(p) {
                    if (typeof (p) !== 'object') {
                        const location = getLocation();
                        return {
                            slug: location.pageSlug || location.pageID,
                            path: location.relativeURL.slice(1, -1),
                        }
                    }
                    return p;
                }

                sendData.page = preparePage(sendData.page);
                if (!sendData.group_order && !actionElement.data.group_order) sendData.group_order = window.currentTab;
                let storeMethod = request.method;
                if ((sendData.parent || sendData.parent_0 || actionElement.parent || actionElement.parent_0) &&
                    (['POST', 'DELETE'].includes(request.method))) storeMethod = 'PATCH';

                if (request.method === 'POST' && request.createTree) sendData = childItemsTree(sendData);

                let sendRequest = {
                    initialRequest: request,
                    data: sendData,
                    url,
                    method: request.method,
                    storeMethod,
                };
                triggerEvent('itemlist:handle-changes', sendRequest);
                let prevData = {};
                for (const f in sendData) {
                    prevData[f] = actionElement.data[f] || sendData[f];
                    prevData.page = preparePage(prevData.page);
                }
                !request.skipHistory && hs.push({...sendRequest, data: prevData});
                current = hs.length - 1;
                console.log('HISTORY', hs)
            }
        })
    }

    static add(item='') {
        if (!item) {
            triggerEvent('form:set-data', {method:'POST', element: actionElement});
            return [];
        }
        let data = setActionData(item);
        if (!Array.isArray(data)) {
            data = [data];
        }
        // console.log(data)
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

    static edit(item='') {
        if (!actionElement.id) return [];
        if (!item) {
            triggerEvent('form:set-data', {method:'PATCH', element: actionElement});
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

    static baseAction(type, name) {
        console.log(Actions.history)
        Actions.history.forEach(hs => hs.element.html.classList.remove(hs.className));
        Actions.history = [];
        let elements = actionElements;
        if (!elements.length) elements = [actionElement];
        elements.forEach(el => {
            el.html.classList.add(name);
            Actions.history.push({
                className: name,
                type: type,
                element: el,
            })
        });
        return [];
    }

    static copy() {
       return Actions.baseAction('copy', 'copied');
    }

    static cut() {
        return Actions.baseAction('cut', 'cutted');
    }

    static paste() {
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

    static delete(elements=[]) {
        if (!elements.length) elements = actionElements;
        const f = el => ({data: structuredClone(el.data), method: 'DELETE', element: el.html});
        let data = elements.map(el => f(el));
        if (!data.length) data = [f(actionElement)];
        return new Promise((resolve) => {
            triggerEvent('user-prompt', {title: "Подтвердить удаление", button: 'ок', windowButton:true, submitCallback: () => {
                resolve(data);
            }});
        });
    }

    static storage() {
        triggerEvent("filemanager-window:toggle", {toggle:true});
        return [];
    }
}