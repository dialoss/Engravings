import React from 'react';
import {ContextMenu} from "components/Modals/ContextMenu";
import {serializeActions} from "./actions";
import {ContextActions} from "./config";
import {useSelector} from "react-redux";

const ItemActions = () => {
    const actionElement = useSelector(state => state.elements.actionElement);
    const actions = serializeActions(ContextActions, actionElement);
    return (
        <ContextMenu actions={actions}></ContextMenu>
    );
};

export default ItemActions;