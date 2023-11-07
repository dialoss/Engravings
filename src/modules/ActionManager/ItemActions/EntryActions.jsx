import React from 'react';
import {ContextMenu} from "components/Modals/ContextMenu";
import {ContextActions} from "./config";
import {useSelector} from "react-redux";
import {getSettingText, serializeActions} from "./helpers";
import formData from 'modules/ActionForm/helpers/FormData.json';


const ItemActions = () => {
    const actionElement = useSelector(state => state.elements.actionElement);
    let actions = structuredClone(ContextActions);
    actionElement.data && actionElement.data.type && Object.values(formData[actionElement.data.type]).forEach(setting =>
        setting.type === 'checkbox' && (actions.edit.actions[setting.name] = {
            callback: 'edit',
            argument: true,
            text: getSettingText(setting.label[0], actionElement.data[setting.name]),
        }));
    //console.log(actions)
    actions = serializeActions(actions, actionElement);
    return (
        <ContextMenu actions={actions}></ContextMenu>
    );
};

export default ItemActions;