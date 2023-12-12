//@ts-nocheck
import {storage} from "./api/storage";
import prettyBytes from "pretty-bytes";
import {UploadStatus} from "./api/google";
import {createRoot} from "react-dom/client";
import Tooltip from "./Tooltip";
import {useAddEvent} from "../../hooks/useAddEvent";
import React from "react";

declare global {
    interface Window {
        FileExplorer: any;
        filemanager: any;
    }
}

export const ExplorerViews = ['default', 'list'];
export const TextBar = [
    {
        name: 'preview',
        text: '',
        sortBy: '',
        order: -1,
    },
    {
        name: 'name',
        text: 'Имя',
        sortBy: 'name',
        order: -1,
    },
    {
        name: 'type',
        text: 'Тип',
        sortBy: 'filetype',
        order: -1,
    },
    {
        name: 'time',
        text: 'Время изменения',
        sortBy: 'modifiedTime',
        order: -1,
    },
    {
        name: 'size',
        text: 'Размер',
        sortBy: 'size',
        order: -1,
    },
];

export function initItems() {
    const dragArea = document.querySelector('.fe_fileexplorer_items_wrap');
    for (const item of dragArea.querySelectorAll('.custom-icon')) {
        if (item.querySelector('img')) {
            item.className = 'custom-icon custom-icon-img'
        }
    }
}

function initLayout() {
    const dragArea: HTMLElement = document.querySelector('.fe_fileexplorer_items_wrap');
    if (!dragArea) return;
    dragArea.ondragstart = e => {
        const itemsAll = window.filemanager.GetCurrentFolder().GetEntries();
        const selected = window.filemanager.GetSelectedItemIDs().map(id => itemsAll.find(it => it.id === id));
        e.dataTransfer.setData('files', JSON.stringify(selected));
    }
    initItems();
    initTooltip();
}

function updateStorageSpace() {
    storage.getSpace().then(d => {
        const space = `Места занято: ${prettyBytes(d.used)} из ${prettyBytes(d.total)}`;
        window.filemanager.SetNamedStatusBarText('space', space);
    });
}

export function changeUploadStatus(status: UploadStatus) {
    window.filemanager
        .SetNamedStatusBarText('message', ' Прогресс: ' + (+status.progress * 100) + '%' + ' ' + status.filename);
}

export function init() {
    let elem = document.querySelector('.filemanager-left');

    let options = {
        tools: {
            item_checkboxes: true,
            download: true,
        },
        initpath: [
            [ '12dZHb2PW4UfLePKrEZnYAikZpoQqSPVb', 'Mymount', { canmodify: true } ],
            [ '1G2OZ6qaAEHhVWv9VmpeURv1mOnGobHtl', 'site', { canmodify: true } ],
            [ '1eqHekdRFxl8A_WCQkf7g9Cg9xSZP9ZJh', 'storage', { canmodify: true } ],
        ],
        onrefresh: function(folder) {
            storage.listFiles(folder.GetPathIDs().slice(-1)[0]).then(data => {
                folder.SetEntries(data.map(f => ({...f, type: f.mimeType})));
                initLayout();
                window.filemanager.changeFolder();
                updateStorageSpace();
            })
        },
        onrename: function(renamed, folder, entry, newname) {
            storage.update(newname)
                .then(data => renamed(...data))
                .catch(er => renamed('Server/network error.'));
        },
        onnewfolder: function(created, folder) {
            storage.newFile([], {
                name: 'New Folder',
                mimeType: 'folder',
                parent: folder.GetPathIDs().slice(-1)[0],
            })
                .then(data => created(data))
                .catch(() => created('Server/network error.'));
        },
        oncopy: function(copied, srcpath, srcids, destfolder) {
            Promise.all(srcids.map(el => storage.copy({id: el, parent:destfolder.GetPathIDs().slice(-1)[0]}))).then(data => {
                    copied(true, data);
                    updateStorageSpace();
                }).catch(() => copied(false, 'Server/network error.'));
        },
        ondelete: function(deleted, folder, ids, entries, recycle) {
            Promise.all(ids.map(el => storage.copy({id: el}))).then(data => {
                deleted(!!data.length);
                options.onrefresh(folder);
                updateStorageSpace();
            }).catch(() => deleted('Server/network error.'))
        },
        onmove: function(moved, srcpath, srcids, destfolder) {
            Promise.all(srcids.map(el => storage.copy({id: el, parent:destfolder.GetPathIDs().slice(-1)[0]}))).then(data => {
                moved(true, data);
            }).catch(() => moved(false, 'Server/network error.'));
        },
        oninitupload: function(startupload, fileinfo) {
            if (fileinfo.type === 'dir') return;
            const folder = fileinfo.folder.valueOf();
            fileinfo.file.parent = folder.GetPathIDs().slice(-1)[0];
            storage.uploadFile(fileinfo.file, [], (status: UploadStatus) => {
                if (status.progress === '1') {
                    window.filemanager.SetNamedStatusBarText('message', 'Файл загружен!', 1000);
                    updateStorageSpace();
                    folder && setTimeout(() => {
                        options.onrefresh(folder);
                    }, 500);
                } else {
                    changeUploadStatus(status);
                }
            });
        },
        oninitdownload: function(startdownload, folder, ids, entries) {
            for (const id of ids) {
                const url = 'https://drive.google.com/uc?id=' + id + '&export=download';
                const link = document.createElement('a');
                link.href = url;
                link.click();
                setTimeout(() => {
                    link.remove();
                }, 0);
            }
        },
    };
    window.filemanager = new window.FileExplorer(elem, options);

    window.addEventListener("keydown", e => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF')
            window.modals.toggle("filemanager");
    });

    window.filemanager.select = (callback) => {
        window.filemanager.selectItems = callback;
        window.modals.open("filemanager");
    };

    window.filemanager.open = () => document.querySelector("#filemanager-local").click();
}

function initTooltip() {
    const wrapper = document.querySelector('.fe_fileexplorer_items_scroll_wrap_inner');
    for (const item of window.filemanager.GetCurrentFolder().GetEntries()) {
        let root: Element = wrapper.querySelector(`.fe_fileexplorer_item_wrap[data-feid="${item.id}"]`);
        if (!root) continue;
        root = root.children[0];
        if (root.lastChild.classList.contains('filemanager-tooltip')) {
            root.removeChild(root.lastChild);
        }

        const tt = document.createElement('div');
        tt.classList.add('filemanager-tooltip');
        root.appendChild(tt);
        createRoot(tt).render(React.createElement(Tooltip, {file: item}));

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
}