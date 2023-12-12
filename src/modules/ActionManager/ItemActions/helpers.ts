//@ts-nocheck
import {IContextAction} from "./config";

export function getSettings(name, data) {
    switch (name) {
        case 'clear_position':
            return {
                style: {
                    'position': 'initial',
                    'top': '0',
                    'left': '0',
                }
            };
        case 'clear_size':
            return {
                style: {
                    'width': 'auto',
                    'height': 'auto',
                    aspectRatio: 'auto',
                }
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

const closeCallback = () => window.modals.close("context");

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
                        window.actions[functionName]();
                    }
                    break;
                case true:
                    callback = () => {
                        !action.stay_opened && closeCallback();
                        window.actions[functionName](name);
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