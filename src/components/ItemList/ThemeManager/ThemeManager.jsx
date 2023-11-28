import React, {useEffect} from 'react';
import {useAddEvent} from "../../../hooks/useAddEvent";
import store from "../../../store";
import {actions} from "../../../modules/ItemList/store/reducers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import "./ThemeManager.scss";
import {sendLocalRequest} from "../../../api/requests";
import {triggerEvent} from "../../../helpers/events";
import {ReactComponent as Edit} from "./edit.svg";
import {ReactComponent as Backup} from "./backup.svg";


export function pageEditable() {
    return store.getState().elements.editPage;
}

const ThemeManager = () => {
    function setEdit() {
        const current = store.getState().elements.editPage;
        store.dispatch(actions.setField({field:'editPage', element: !current}));
    }
    useAddEvent('keydown', e => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyE') setEdit();
        if (e.ctrlKey && e.code === 'KeyS') {
            e.preventDefault();
            makeBackup();
        }
    })
    function makeBackup() {
        triggerEvent("alert:trigger", {
            type:'loader',
            timeout: 100000,
        })
        sendLocalRequest('/api/backup/').then(r => {
            triggerEvent("alert:close");
            setTimeout(() => {
                if (r.success) triggerEvent("alert:trigger", {
                    type:'success',
                    body:'Дамп сохранен на почту',
                    timeout: 4000,
                })
            }, 300);
        });
    }
    return (
        <div className={'page-editor'}>
            <ActionButton modalToggle={false} onClick={makeBackup}><Backup></Backup></ActionButton>
            <ActionButton modalToggle={false} onClick={setEdit}><Edit></Edit></ActionButton>
        </div>
    );
};

export default ThemeManager;