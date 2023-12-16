//@ts-nocheck
import React, {useEffect, useRef} from 'react';
import {selectItems} from "../helpers";
import {TextBar} from "../config";

const Toolbar = ({data, setData}) => {
    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }
    const ref = useRef<HTMLElement>(null);
    const toolbar = document.querySelector('.fe_fileexplorer_body_wrap_outer');

    useEffect(() => {
        toolbar && toolbar.parentElement?.insertBefore(ref.current, toolbar);
    }, [toolbar]);

    return (
        <div className="filemanager-header toolbar">
            <div className="filemanager-sort fe_fileexplorer_item_text" ref={ref} style={{paddingLeft:54,paddingRight:20}}>
            </div>
            <div className="filemanager__buttons">
                <div className="filemanager-search">
                </div>
                <div className="filemanager__button" onClick={() => window.filemanager.changeView()}>Вид</div>
                <div className="filemanager__button refresh" onClick={refreshFolder}>
                    Обновить
                </div>
                <div className="filemanager__button" onClick={selectItems}>Добавить</div>
            </div>
        </div>
    );
};

export default Toolbar;