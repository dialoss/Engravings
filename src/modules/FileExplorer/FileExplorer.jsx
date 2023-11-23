import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./file-explorer/file-explorer.css";
import "./file-explorer/file-explorer";
import {ExplorerViews, init, initItems, initTooltip, TextBar} from "./config";
import "./Custom.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {ModalManager} from "../../components/ModalManager";
import {createRoot} from "react-dom/client";
import {useAddEvent} from "../../hooks/useAddEvent";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {ImageEditor} from "./ImageEditor/ImageEditor";
import WindowButton from "../../ui/Buttons/WindowButton/WindowButton";
import {SearchContainer, SortContainer} from "../../ui/Tools/Tools";
import {fetchRequest, sendRequest} from "../../api/requests";
import {fileToItem, fileToMedia} from "./helpers";
import {driveRequest} from "./api/google";
import {useSelector} from "react-redux";

const Toolbar = ({data, setData}) => {
    return (
        <div className="filemanager-sort fe_fileexplorer_item_text">
            {
                TextBar.map(t => <SortContainer data={data}
                                                config={t}
                                                setData={setData} key={t.sortBy}>
                </SortContainer>)
            }
        </div>
    );
}

const Sidebar = ({image}) => {
    if (!image.meta) return;
    return (
        <div className="filemanager__sidebar">
            <img src={image.meta.url} alt=""/>
        </div>
    );
}

const FileExplorer = () => {
    const location = useSelector(state => state.location).pageSlug;
    useLayoutEffect(()=>{
        window.filemanager = init();
    },[]);
    useLayoutEffect(() => {
        triggerEvent('filemanager-window:check-opened', isOpened => {
            !isOpened && driveRequest({
                request: {
                    method: 'POST',
                    parent: '',
                    action: 'create folder with path',
                    data: {
                        path: ['site', 'storage', location],
                    }},
                callback: (folder) => {
                    window.filemanager.SetPath([...window.filemanager.settings.initpath,
                        [ folder[0].id, folder[0].name, { canmodify: true } ]]);
                }
            })
        })
    }, [location]);
    useEffect(() => {
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
                ref.current.style.setProperty('--icon-size', scale.current + 'em');
            }
        };
        window.addEventListener('mousewheel', zoomController, {passive: false});
        return () => window.removeEventListener('mousewheel', zoomController);
    }, []);

    const ref = useRef();
    const scale = useRef();
    const [view, setView] = useState(0);
    const [folder, setFolder] = useState([]);
    const [search, setSearch] = useState([]);
    const [curImage, setImage] = useState({});

    function changeView() {
        setView(v => (v + 1) % ExplorerViews.length);
    }

    async function addItems() {
        const itemsAll = window.filemanager.GetCurrentFolder().GetEntries();
        const selected = window.filemanager.GetSelectedItemIDs()
            .map(id => itemsAll.find(it => it.id === id));
        for (const item of selected) {
            const file = fileToItem({...item, type: item.filetype});
            triggerEvent("action:callback", [file]);
            triggerEvent("filemanager-window:toggle", {isOpened: false});
        }
    }

    const toolbar = useRef();

    useEffect(() => {
        toolbar.current && !window.filemanager.fromSearch && toolbar.current.render(<Toolbar data={search} setData={setSearch}></Toolbar>);
    }, [search]);

    const openEditor = (folder, entry) => {
        if (entry.filetype !== 'image') return;
        setImage({meta: entry});
        fetchRequest(entry.url).then(res => res.arrayBuffer()).then(file => {
            const url = fileToMedia(file);
            let img = new Image();
            img.src = url;
            setImage({image:img, folder: window.filemanager.GetCurrentFolder(), meta: entry});
        });
    }

    useEffect(() => {
        scale.current = 4;
        ref.current.style.setProperty('--icon-size', scale.current + 'em');

        let textBar = document.createElement('div');
        textBar.classList.add('filemanager-textbar');
        let field = ref.current.querySelector('.fe_fileexplorer_toolbar');
        field.parentNode.insertBefore(textBar, field.nextSibling);
        toolbar.current = createRoot(textBar);

        window.filemanager.addEventListener('open_file', openEditor);

    }, []);

    useLayoutEffect(() => {
        if (!ref.current) return;
        initTooltip(ref, folder);
    }, [folder]);

    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }
    useLayoutEffect(() => {
        if (!window.filemanager.GetCurrentFolder) return;
        window.filemanager.GetCurrentFolder().SetEntries(search);
        initItems();
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
            event.detail.callback({...entry, url: entry.id, type: entry.filetype, filename: entry.name});
            triggerEvent("filemanager-window:toggle", {isOpened: false});
            window.filemanager.removeEventListener('open_file', openFile);
            window.filemanager.addEventListener('open_file', openEditor);
        }
        window.filemanager.removeEventListener('open_file', openEditor);
        window.filemanager.addEventListener('open_file', openFile);
        triggerEvent("filemanager-window:toggle", {isOpened: true});
    })

    useAddEvent('keydown', e => {
       if (e.ctrlKey && e.shiftKey && e.code === 'KeyF')
           triggerEvent("filemanager-window:toggle", {toggle: true});
    });

    return (
        <ModalManager name={"filemanager-window"} closeConditions={['btn', 'esc']}>
            <TransformItem config={isMobileDevice() ? {} : {position:'fixed', left:'20%', top:'100px', height:'600px', width:'800px'}}
                           style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}
                           className={'edit'}
                           data-type={'modal'}>
                <div className={"filemanager view-" + ExplorerViews[view]} ref={ref}>
                    <div className="filemanager-left">
                        <div className={"filemanager-header__wrapper"}>
                            <div className="filemanager-header buttons transform-origin">
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
                                <div className="button filemanager-view__button" onClick={refreshFolder}>
                                    Обновить
                                </div>
                                <div className="button filemanager-view__button" onClick={changeView}>Вид</div>
                                <div className="button filemanager-view__button" onClick={addItems}>Добавить</div>
                            </div>
                        </div>
                    </div>
                    <div className="filemanager-right">
                        <ImageEditor image={curImage}></ImageEditor>
                        {/*<Sidebar image={curImage}></Sidebar>*/}
                    </div>
                </div>
            </TransformItem>
        </ModalManager>
    );
};

export default FileExplorer;
