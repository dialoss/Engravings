import {triggerEvent} from "helpers/events";
import {actionElement, actionElements, setUnselected} from "modules/ActionManager/components/helpers";
import {setActionData} from "./config";
import {getSettings} from "./helpers";
import {getLocation} from "../../../hooks/getLocation";

let hs = [];
let current = 0;

window.addEventListener('keydown', e => {
    if (e.ctrlKey && hs.length) {
        let key = false;
        switch (e.key) {
            case 'z':
                key = true;
                current = Math.max(0, current - 1);
                break;
            case 'y':
                key = true;
                current = Math.min(hs.length - 1, current + 1);
                break;
        }
        //console.log(e.key, key, current)
        key && triggerEvent('itemlist:handle-changes', hs[current]);
    }
})

export default class Actions {
    static element = null;
    static elements = [];
    static history = [];

    static action(requests) {
        console.log(requests)
        for (let i = requests.length - 1; i >= 0; i--) {
            let request = requests[i];
            let sendData = request.data || {};

            if (request.specifyElement) sendData.id = actionElement.id;
            if (request.specifyParent && !('parent' in sendData)) sendData.parent = actionElement.id;

            let url = '/api/items/';
            if (request.method !== 'POST') {
                if (!actionElement.id) request.method = 'POST';
                else {
                    let id = sendData.id;
                    if (!id) id = actionElement.id;
                    url += id + '/';
                }
            }
            if (!sendData.page) {
                const location = getLocation();
                sendData.page = {
                    slug: location.pageSlug || location.pageID,
                    path: location.relativeURL.slice(1, -1),
                }
            }
            let storeMethod = request.method;
            if ((sendData.parent || sendData.parent_0 || actionElement.parent || actionElement.parent_0) &&
                (['POST', 'DELETE'].includes(request.method))) storeMethod = 'PATCH';

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
            }
            hs.push({...sendRequest, data: prevData});
            current = hs.length - 1;
        }
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
        //console.log(data)
        return data.map(d => ({
            method: 'POST',
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
        actionElements.forEach(el => el.html.classList.add(name));
        Actions.history.push({
            className: name,
            type: type,
            elements: actionElements,
        });
        if (!actionElements.length) Actions.history.push({type, elements: [actionElement]})
        return [];
    }

    static copy() {
       return Actions.baseAction('copy', 'copied');
    }

    static cut() {
        return Actions.baseAction('cut', 'cutted');
    }

    static paste() {
        let historyData = Actions.history.slice(-1)[0];
        let action = actionElement;

        let actionData = structuredClone(action.data);

        let request = [];
        historyData.elements.forEach(el => {
            request.push({data: {
                    ...el.data,
                    display_pos: actionData.display_pos,
                    parent: action.id,
                    id: '',
                    parent_0: '',
                },
                method: 'POST', });
        });

        if (historyData.type === 'cut') {
            request = [...Actions.delete(historyData.elements), ...request];
        }
        function clearSelection(elements, name) {
            elements.forEach(el => el.html.classList.remove(name));
        }
        clearSelection(historyData.elements, historyData.className);
        return request;
    }

    static delete(elements=[]) {
        if (!elements.length) elements = actionElements;
        const f = el => ({data: {
            id: el.id
        }, method: 'DELETE', element: el.html});
        let data = elements.map(el => f(el));
        if (!data.length) data = [f(actionElement)];
        return data;
    }

    static storage() {
        triggerEvent("filemanager-window:toggle", {toggle:true});
        return [];
    }
}