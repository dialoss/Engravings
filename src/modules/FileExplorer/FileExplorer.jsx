import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./file-explorer/file-explorer.css";
import "./file-explorer/file-explorer";
import {init} from "./config";
import "./Custom.scss";
import {getElementFromCursor, triggerEvent} from "../../helpers/events";
import {ModalManager} from "../../components/ModalManager";
import FormInput from "../../components/Modals/MyForm/Input/FormInput";
import {createRoot} from "react-dom/client";
import Tooltip from "./Tooltip";
import {useAddEvent} from "../../hooks/useAddEvent";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {ImageEditor} from "./ImageEditor/ImageEditor";

export function fileToItem(data) {
    return {
        data: {
            // position: 'absolute',
            show_shadow: false,
            width: 50,
            urn: data.urn,
            type: data.type,
            filename: data.name,
            url: "https://drive.google.com/uc?id=" + data.id,
        },
        specifyParent: true,
        method: 'POST',
    }
}

export function initLayout() {
    let items = document.querySelectorAll('.fe_fileexplorer_item_wrap_inner');
    for (const item of items) {
        item.ondragstart = e => {
            let wrapper = item.closest('.fe_fileexplorer_item_wrap');
            let model = item.getAttribute('data-model');
            e.dataTransfer.setData('files', JSON.stringify([fileToItem({
                id: wrapper.getAttribute('data-feid'),
                urn: model,
                type: item.getAttribute('data-itemtype'),
                name: item.getAttribute('data-itemname'),
            })]));
        };
    }
}

let globalsearch = [];

export const SearchContainer = ({placeholder, inputCallback=() => {}, data, setData, searchBy, ...props}) => {
    const [value, setValue] = useState('');

    function handleSearch(query) {
        let newData = [];
        data.forEach(item => {
            let val = item;
            for (const p of searchBy.split('.')) val = val[p];
            if (val.toLowerCase().includes(query.toLowerCase())) {
                newData.push(item);
            }
        })
        setData(newData);
    }

    return (
        <FormInput placeholder={placeholder}
            data={{
            name: 'search',
            value,
            callback: (e) => {
                let query = e.target.value;
                if (!query) setData(data);
                else handleSearch(query);
                inputCallback(query);
                setValue(query);
            },
        }} {...props}></FormInput>
    );
}

const SortContainer = ({data, setData, config}) => {
    const field = config.sortBy;

    function handleSort() {
        window.filemanager.fromSearch = true;

        // console.log(globalsearch)
        let test = JSON.parse(JSON.stringify(globalsearch));
        let a = test.sort((a,b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
        // console.log(a)
        setData(structuredClone(a));
    }
    return (
        <p className={config.name} onClick={handleSort}>{config.text}</p>
    );
}

const ExplorerViews = ['default', 'list'];
const TextBar = [
    {
        name: 'name',
        text: 'Имя',
        sortBy: 'name',
    },
    {
        name: 'time',
        text: 'Время изменения',
        sortBy: 'modifiedTime',
    },
    {
        name: 'size',
        text: 'Размер',
        sortBy: 'size',
    },
    ];

const FileExplorer = () => {
    useEffect(() => {
        window.filemanager = init();
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
        window.addEventListener('mousewheel', zoomController, {passive: false});
        return () => window.removeEventListener('mousewheel', zoomController);
    }, []);

    const ref = useRef();
    const scale = useRef();
    const [view, setView] = useState(0);
    const [folder, setFolder] = useState([]);
    const [search, setSearch] = useState([]);
    const [curImage, setImage] = useState(null);

    useEffect(() => {
        ref.current.querySelector('.filemanager-view__button').addEventListener('click', () => setView(v => (v + 1) % ExplorerViews.length));
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
            console.log(entry)
        }
        window.filemanager.addEventListener('open_file', openFile);
        // return () => window.filemanager.removeEventListener('open_file', openFile);
    }, []);

    useLayoutEffect(() => {
        if (!ref.current) return;
        const wrapper = ref.current.querySelector('.fe_fileexplorer_items_scroll_wrap_inner');
        for (const item of folder) {
            let root = ref.current.querySelector(`.fe_fileexplorer_item_wrap[data-feid="${item.id}"]`);
            if (!root) continue;
            root = root.children[0];
            const tt = document.createElement('div');
            tt.classList.add('filemanager-tooltip');
            root.appendChild(tt);
            createRoot(tt).render(<Tooltip data={item}></Tooltip>);
            root.addEventListener('mouseover', (e) => {
                if (root.contains(e.relatedTarget)) return;
                let block = root.getBoundingClientRect();
                let px = e.clientX - block.left + 20;
                let wr = wrapper.getBoundingClientRect();
                if (px + 10 >= wr.left + wr.width) px = e.clientX - tt.getBoundingClientRect().width - 20;
                tt.style.left = px + 'px';
                tt.style.top = e.clientY - block.top - 20 + 'px';
            });
        }
    }, [folder]);

    function refreshFolder() {
        window.filemanager.RefreshFolders(true);
    }
    // console.log(search)

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
        globalsearch = f.GetEntries();
    });


    useAddEvent("filemanager:open", (event) => {
        // window.filemanager.removeEventListener('open_file', openFile);

        const openFile = (folder, entry) => {
            event.detail.callback(entry);
            triggerEvent("filemanager-window:toggle", {isOpened: false});
        }
        window.filemanager.addEventListener('open_file', openFile);
        triggerEvent("filemanager-window:toggle", {isOpened: true});
    })

    return (
        <ModalManager name={"filemanager-window:toggle"} closeConditions={['btn', 'esc']}>
            <TransformItem config={{position:'fixed', left:'20', top:'150', width:'70', zIndex:25}} style={{bg: 'bg-none'}}>
            <div className={"filemanager"} ref={ref}>
                <div className="filemanager-left">
                    <div className={"filemanager-header__wrapper transform-origin"}>
                        <div className="filemanager-header buttons">
                            <div className="window-close filemanager-header__button close">
                            </div>
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
                            <div className="button filemanager-view__button">Вид</div>
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