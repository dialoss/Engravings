//@ts-nocheck
import React from 'react';
import {useAddEvent} from "../../../hooks/useAddEvent";
import store from "../../../store";
import {actions} from "../../../modules/ItemList/store/reducers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import "./EventManager.scss";
import {sendLocalRequest} from "../../../api/requests";
import {ReactComponent as Edit} from "./edit.svg";
import {ReactComponent as Backup} from "./backup.svg";
import {useAppSelector} from "hooks/redux";
import {ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";
import {Intermediate} from "../../../modules/ActionManager/ItemActions/actions";
import Slider from "../../../ui/Slider/Slider";
import ToggleButton from "../../../ui/Buttons/ToggleButton/ToggleButton";
import {ReactComponent as IconChevronRight} from "../../../ui/Iconpack/icons/chevron-right.svg";
import {CSSEditor} from "../CSSEditor/CSSEditor";
import CodeEditor from "../CodeEditor/CodeEditor";

let interval = null;

function setItemStyle(style) {
    const item = window.actions.elements.focused;
    if (!item || item.type === 'page') return;
    if (interval) clearInterval(interval);
    window.actions.request("PATCH", {...item, style}, 'items', true);
    interval = setInterval(() => {
        window.actions.request("PATCH", {...item, style});
        clearInterval(interval);
    }, 2000);
}

const EventManager = () => {
    function setEdit() {
        const current = store.getState().elements.editPage;
        store.dispatch(actions.setField({field:'editPage', data: !current}));
    }
    useAddEvent('keydown', e => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyE') setEdit();
        if (e.ctrlKey && e.code === 'KeyS') {
            e.preventDefault();
            makeBackup();
        }
    })
    const edit = useAppSelector(state => state.elements.editPage);
    const elements = useAppSelector(state => state.elements);
    const item = elements.focused;
    const intermediate: Intermediate[] = elements.intermediate;
    const state = useAppSelector(state => state.elements.pageItems);
    return (
        <div className={'page-editor'} onMouseDown={e => e.stopPropagation()}>
            <div className="buttons">
                <ActionButton memorizeState={true} modalToggle={false} onClick={setEdit}><Edit></Edit></ActionButton>
            </div>
            <div className="item__style">
                <Slider togglers={[
                    {
                        element: <ToggleButton isOpened={true} width={40}>
                            <IconChevronRight/>
                        </ToggleButton>,
                        action: 'toggle',
                        callback: () => {}
                    }
                    ]}>
                {/*{item.id && <CSSEditor id={item.id} styles={item.style} setStyle={setItemStyle}></CSSEditor>}*/}
                </Slider>
            </div>
            {edit&&<CodeEditor id={item.id} style={item.style} setStyle={setItemStyle}></CodeEditor>}
        </div>
    );
};

export default EventManager;