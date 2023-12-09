import React, {useEffect, useRef, useState} from 'react';
import {SearchContainer, SortContainer} from "../../../ui/Tools/Tools";
import {selectItems} from "../helpers";
import {getElementFromCursor} from "../../../helpers/events";
import {ExplorerViews, TextBar} from "../config";

const Toolbar = ({data, setData}) => {
    const scale = useRef<number>(4);
    const [view, setView] = useState(0);

    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }

    function changeView() {
        setView(v => (v + 1) % ExplorerViews.length);
    }

    useEffect(() => {
        // ref.current.style.setProperty('--icon-size', scale.current + 'em');
        // ref.current.style.setProperty('--scale', scale.current);

        const zoomController = (e) => {
            if(e.ctrlKey) {
                if (!getElementFromCursor(e, 'fe_fileexplorer_wrap')) return;
                e.preventDefault();
                e.stopPropagation();
                if (e.deltaY < 0) {
                    scale.current = Math.min(15, (scale.current + 1));
                } else {
                    scale.current = Math.max(1, (scale.current - 1));
                }
                // ref.current.style.setProperty('--icon-size', scale.current + 'em');
                // ref.current.style.setProperty('--scale', scale.current);
            }
        };
        window.addEventListener('mousewheel', zoomController, {passive: false});
        return () => window.removeEventListener('mousewheel', zoomController);
    }, []);

    return (
        <div className="filemanager-header toolbar">
            <div className="filemanager-search">
                <SearchContainer data={data}
                                 searchBy={'name'}
                                 setData={setData}
                                 placeholder={'Поиск по файлам'}>
                </SearchContainer>
            </div>
            <div className="filemanager__button refresh" onClick={refreshFolder}>
                Обновить
            </div>
            <div className="filemanager__button" onClick={changeView}>Вид</div>
            <div className="filemanager__button" onClick={selectItems}>Добавить</div>
            <div className="filemanager-sort fe_fileexplorer_item_text">
                {
                    TextBar.map(t => <SortContainer data={data}
                                                    config={t}
                                                    setData={setData} key={t.sortBy}>
                    </SortContainer>)
                }
            </div>
        </div>
    );
};

export default Toolbar;