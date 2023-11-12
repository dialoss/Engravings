import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./file-explorer/file-explorer.css";
import "./file-explorer/file-explorer";
import {ExplorerViews, init, initTooltip, TextBar} from "./config";
import "./Custom.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {ModalManager} from "../../components/ModalManager";
import {createRoot} from "react-dom/client";
import {useAddEvent} from "../../hooks/useAddEvent";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {ImageEditor} from "./ImageEditor/ImageEditor";
import WindowButton from "../../ui/Buttons/WindowButton/WindowButton";
import {SearchContainer, SortContainer} from "../../ui/Tools/Tools";

const FileExplorer = () => {
    useEffect(() => {
        window.filemanager = init();
    }, []);

    const zoomController = (e) => {
        if(e.ctrlKey) {
            if (!getElementFromCursor(e, 'fe_fileexplorer_wrap')) return;
            e.preventDefault();
            if (e.deltaY < 0) {
                scale.current = Math.min(15, (scale.current + 1));
            } else {
                scale.current = Math.max(1, (scale.current - 1));
            }
            ref.current.style.setProperty('--icon-size', scale.current + 'em');
        }
    };
    useAddEvent('mousewheel', zoomController);

    const ref = useRef();
    const scale = useRef();
    const [view, setView] = useState(0);
    const [folder, setFolder] = useState([]);
    const [search, setSearch] = useState([]);
    const [curImage, setImage] = useState(null);

    function changeView() {
        setView(v => (v + 1) % ExplorerViews.length);
    }

    useEffect(() => {
        scale.current = 4;
        ref.current.style.setProperty('--icon-size', scale.current + 'em');

        let textBar = document.createElement('div');
        textBar.classList.add('filemanager-textbar');
        let field = ref.current.querySelector('.fe_fileexplorer_toolbar');
        field.parentNode.insertBefore(textBar, field.nextSibling);

        const filemanagerRoot = createRoot(textBar);
        filemanagerRoot.render(<div className="filemanager-sort fe_fileexplorer_item_text">
            {
                TextBar.map(t => <SortContainer data={search}
                                                config={t}
                                                setData={setSearch} key={t.sortBy}>
                </SortContainer>)
            }
        </div>);


        const openFile = (folder, entry) => {
            if (entry.filetype !== 'image') return;
            let pic = new Image();
            pic.src = entry.url;
            pic.onload = () => {
                setImage(pic);
            }
        }
        window.filemanager.addEventListener('open_file', openFile);
    }, []);

    useLayoutEffect(() => {
        if (!ref.current) return;
        initTooltip(ref, folder);
    }, [folder]);

    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }

    useLayoutEffect(() => {
        try {
            // console.log(search)
            window.filemanager.GetCurrentFolder().SetEntries(search);
        } catch (e) {}
    }, [search]);

    useAddEvent('filemanager:changeFolder', () => {
        if (window.filemanager.fromSearch) {
            window.filemanager.fromSearch = false;
            return;
        }
        const f = window.filemanager.GetCurrentFolder();
        setFolder(f.GetEntries());
        setSearch(f.GetEntries());
    });


    useAddEvent("filemanager:open", (event) => {
        const openFile = (folder, entry) => {
            event.detail.callback(entry);
            triggerEvent("filemanager-window:toggle", {isOpened: false});
        }
        window.filemanager.addEventListener('open_file', openFile);
        triggerEvent("filemanager-window:toggle", {isOpened: true});
    })

    return (
        <ModalManager name={"filemanager-window:toggle"} closeConditions={['btn', 'esc']}>
            <TransformItem config={isMobileDevice() ? {} : {position:'fixed', left:'20%', top:'100px', width:'70%', zIndex:25}}
                           style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}  data-type={'modal'}>
            <div className={"filemanager"} ref={ref}>
                <div className="filemanager-left">
                    <div className={"filemanager-header__wrapper transform-origin"}>
                        <div className="filemanager-header buttons">
                            <WindowButton type={'close'}></WindowButton>
                        </div>
                        <div className="filemanager-header toolbar">
                            <div className="filemanager-search">
                                <SearchContainer data={folder}
                                                 searchBy={'name'}
                                                 setData={setSearch}
                                                 placeholder={'Поиск по файлам'}>
                                </SearchContainer>
                            </div>
                            <div className="button refresh" onClick={refreshFolder}>
                                Обновить
                            </div>
                            <div className="button filemanager-view__button" onClick={changeView}>Вид</div>
                        </div>
                    </div>
                    <div id={"filemanager"} className={'view-' + ExplorerViews[view]}></div>
                </div>
                <ImageEditor image={curImage}></ImageEditor>
            </div>
            </TransformItem>
        </ModalManager>
    );
};

export default FileExplorer;