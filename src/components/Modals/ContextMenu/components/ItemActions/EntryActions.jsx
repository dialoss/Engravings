import React from 'react';
import {ContextMenu} from "components/Modals/ContextMenu/index";
import Actions, {serializeActions} from "./actions";
import {useSelector} from "react-redux";
import {ContextActions} from "./config";
import {actionElement} from "modules/ActionManager/components/helpers";

const ItemActions = () => {
    const actions = serializeActions(ContextActions, actionElement);
    return (
        <ContextMenu actions={actions}></ContextMenu>
    );
};

export default ItemActions;