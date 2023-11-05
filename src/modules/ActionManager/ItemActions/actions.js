import {triggerEvent} from "helpers/events";
import {actionElement, actionElements, setUnselected} from "modules/ActionManager/components/helpers";
import {setActionData} from "./config";
import {getSettings, getSettingText} from "./helpers";
import {getLocation} from "../../../hooks/getLocation";

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
        }
    }

    static add(item='') {
        if (!item) {
            triggerEvent('form:set-data', {method:'POST', element: actionElement});
            return [];
        }
        return [{
            method: 'POST',
            specifyParent: true,
            data: {
                type: item,
                display_pos: actionElement.display_pos,
                ...setActionData(item),
            }
        }]
    }

    static edit(item='') {
        if (actionElement.id === -1) return [];
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

const closeCallback = () => triggerEvent('context-window:toggle', {isOpened: false});

export function serializeActions(actions, actionElement, depth=0) {
    actions = structuredClone(actions);
    return Object.keys(actions).map(name => {
        let action = actions[name];
        let subActions = action.actions || [];
        let text = action.text;
        if (actionElement.id && ['show_shadow', 'show_date'].includes(name)) {
            text = getSettingText(text, actionElement.data && actionElement.data[name]);
        }
        let functionName = action.callback || name;
        let callback = () => {};
        switch (action.argument) {
            case null:
                break;
            case false:
                callback = () => {
                    closeCallback();
                    Actions.action(Actions[functionName]());
                }
                break;
            case true:
                callback = () => {
                    closeCallback();
                    Actions.action(Actions[functionName](name));
                }
                break;
        }
        return {
            text,
            actions: serializeActions(subActions, actionElement, depth + 1),
            callback,
        };
    });
}