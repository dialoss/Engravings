import {triggerEvent} from "../../../helpers/events";
import Actions from "./actions";

export function getSettings(name, data) {
    switch (name) {
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
        default:
            return {
                [name]: !data[name],
            };
    }
}

export function getSettingText(text, positive) {
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
        let functionName = action.callback || name;
        let callback = () => {};
        switch (action.argument) {
            case null:
                break;
            case false:
                callback = () => {
                    !action.stay_opened && closeCallback();
                    Actions.action(Actions[functionName]());
                }
                break;
            case true:
                callback = () => {
                    !action.stay_opened && closeCallback();
                    Actions.action(Actions[functionName](name));
                }
                break;
        }
        if (action.toggler) callback = (e) => console.log(e)
        return {
            ...action,
            text,
            actions: serializeActions(subActions, actionElement, depth + 1),
            callback,
        };
    });
}