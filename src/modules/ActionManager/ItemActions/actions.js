import {triggerEvent} from "helpers/events";
import {actionElement, actionElements, setUnselected} from "modules/ActionManager/components/helpers";

export default class Actions {
    static element = null;
    static elements = [];
    static history = [];

    static action(requests) {
        console.log(requests)
        for (let i = requests.length - 1; i >= 0; i--) {
            let request = requests[i];

            if (request.specifyElement) request.id = actionElement.id;
            if (request.specifyParent) request.parent = actionElement.id;

            let url = '/api/items/';
            if (request.method !== 'POST') {
                if (!actionElement.id) request.method = 'POST';
                else {
                    let id = request.id;
                    if (!id) id = actionElement.id;
                    url += id + '/';
                }
            }

            let storeMethod = request.method;
            if ((request.parent || request.parent_0) && request.method === 'POST') storeMethod = 'PATCH';

            request = {
                data: request,
                url,
                method: request.method,
                storeMethod,
            };
            triggerEvent('itemlist:handle-changes', request);
        }
    }

    static addQuick() {
        return [{
            method: 'POST',
            type: 'base',
            specifyParent: true,
            description: 'Text Field',
            title: 'Text Field',
            display_pos: actionElement.display_pos,
        }];
    }

    static add(item='') {
        if (!item) {
            triggerEvent('form:set-data', {method:'POST', element: actionElement});
            return [];
        }
        let itemData = {
            type: item,
            display_pos: actionElement.display_pos,
        }
        switch (item) {
            case 'table':
                itemData.width = 30;
                itemData.height = 100;
            case 'textfield':
                itemData.text = 'Text Field';
                break;
            case 'price':
                itemData.price = '999';
                break;
            case 'timeline_entry':
                itemData.title = 'test';
                break;
            case 'intro':
                itemData.type = 'base';
                itemData.create_items = true;
                itemData.container_width = 900;
                itemData.items = [
                    {
                        show_shadow: false,
                        movable: false,
                        type: 'subscription',
                        left: 10,
                        width: 35,
                        height: 500,
                        top: 50,
                        position: 'absolute',
                    },
                    {
                        text: '<h1>Заголовок</h1>',
                        type: 'textfield',
                        movable: false,
                        left: 50,
                        top: 80,
                        width: 50,
                        show_shadow: false,
                        position: 'absolute',
                    },
                    {
                        type: 'textfield',
                        text: 'Текст',
                        top: 160,
                        width: 50,
                        left: 50,
                        show_shadow: false,
                        position: 'absolute',
                    },
                    {
                        type: 'price',
                        price: 999,
                        button: "Заказать изготовление",
                        left: 25,
                        width: 45,
                        top: 500,
                        show_shadow: false,
                        position: 'absolute',
                    }
                ];
                break;
        }
        return [{
            method: 'POST',
            specifyParent: true,
            ...itemData,
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
         ...getSettings(item, actionElement.data)}];
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
        setUnselected();
        let historyData = Actions.history.slice(-1)[0];
        let action = actionElement;

        let actionData = structuredClone(action.data);

        let request = [];
        historyData.elements.forEach(el => {
            request.push({...el.data, display_pos: actionData.display_pos,
                method: 'POST', parent: action.id, id: '', parent_0: '', create_items: true});
        });

        if (historyData.type === 'cut') {
            request = [...request, ...Actions.delete(historyData.elements)];
        }
        function clearSelection(elements, name) {
            elements.forEach(el => el.html.classList.remove(name));
        }
        clearSelection(historyData.elements, historyData.className);
        return request;
    }

    static delete(elements=[]) {
        const f = el => ({id: el.id, method: 'DELETE'});
        let data = elements.map(el => f(el));
        if (!data.length) data = [f(actionElement)];
        return data;
    }
}

function getSettings(name, data) {
    switch (name) {
        case 'show_date': case 'show_shadow':
            return {
                [name]: !data[name],
            };
        case 'clear_position':
            return {
                'position': 'initial',
                'top': '0',
                'left': '0',
            };
        case 'clear_size':
            return {
                'width': 'auto',
            };
    }
}

function getSettingText(text, positive) {
    if (positive) {
        text = "Не " + text.toLowerCase();
    }
    return text;
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