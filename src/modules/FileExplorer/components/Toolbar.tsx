//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import {SearchContainer, SortContainer} from "../../../ui/Tools/Tools";
import {selectItems} from "../helpers";
import {getElementFromCursor} from "../../../helpers/events";
import {ExplorerViews, TextBar} from "../config";
import {doc} from "firebase/firestore";

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
                {
                    TextBar.map(t => <SortContainer data={data}
                                                    config={t}
                                                    setData={setData} key={t.sortBy}>
                    </SortContainer>)
                }
            </div>
            <div className="filemanager__buttons">
                <div className="filemanager-search">
                    <SearchContainer data={data}
                                     searchBy={'name'}
                                     setData={setData}
                                     placeholder={'Поиск по файлам'}>
                    </SearchContainer>
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