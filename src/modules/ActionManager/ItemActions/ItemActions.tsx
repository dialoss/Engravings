//@ts-nocheck
import React from 'react';
import {ContextMenu} from "components/Modals/ContextMenu";
import {ContextActions, DefaultEdit, IContextAction} from "./config";
import {useAppSelector} from "hooks/redux";
import {serializeActions} from "./helpers";

const ItemActions = () => {
    const actionElement = useAppSelector(state => state.elements.focused);
    let actions: IContextAction = ContextActions;

    actions.update.actions = DefaultEdit;
    // actionElement.style && mapFields(formData[actionElement.type]).forEach(setting =>
    //     setting.type === 'checkbox' && (actions.update.actions[setting.name] = {
    //         callback: 'update',
    //         argument: true,
    //         text: getSettingText(setting.label, actionElement.style[setting.name]),
    //     }));
    return (
        <ContextMenu actions={serializeActions(actions, actionElement)}></ContextMenu>
    );
};

export default ItemActions;