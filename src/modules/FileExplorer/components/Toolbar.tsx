//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import {SearchContainer, SortContainer} from "../../../ui/Tools/Tools";
import {selectItems} from "../helpers";
import {getElementFromCursor} from "../../../helpers/events";
import {ExplorerViews, TextBar} from "../config";

const Toolbar = ({data, setData}) => {
    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }

    return (
        <div className="filemanager-header toolbar">
            <div className="filemanager-sort fe_fileexplorer_item_text">
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