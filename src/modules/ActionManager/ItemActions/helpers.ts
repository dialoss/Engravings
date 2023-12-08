import {triggerEvent} from "../../../helpers/events";
import Actions from "./actions";
import {IContextAction} from "./config";

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
                'height': 'auto',
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

export function serializeActions(actions, actionElement, depth=0) : IContextAction[] {
    return Object.keys(actions).map(name => {
        let action = actions[name];
        let subActions = action.actions || [];
        let text = action.text;
        let functionName = action.callback || name;
        let callback = () => {};
        if (typeof action.callback === 'function') callback = action.callback;
        else {
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
        }
        return {
            ...action,
            text,
            actions: serializeActions(subActions, actionElement, depth + 1),
            callback,
        };
    });
}