import React from 'react';
import {ContextMenu} from "components/Modals/ContextMenu";
import {ContextActions, DefaultEdit, IContextAction} from "./config";
import {useSelector} from "react-redux";
import {getSettingText, serializeActions} from "./helpers";
import formData from "../../ActionForm/helpers/data.json";
import {mapFields} from "../../ActionForm/helpers/FormData";

const ItemActions = () => {
    const actionElement = useSelector(state => state.elements.actionElement);
    let actions: IContextAction = ContextActions;
    actions.edit.actions = DefaultEdit;
    actionElement.data && actionElement.data.type && mapFields(formData[actionElement.data.type]).forEach(setting =>
        setting.type === 'checkbox' && (actions.edit.actions[setting.name] = {
            callback: 'edit',
            argument: true,
            text: getSettingText(setting.label, actionElement.data[setting.name]),
        }));
    return (
        <ContextMenu actions={serializeActions(actions, actionElement)}></ContextMenu>
    );
};

export default ItemActions;