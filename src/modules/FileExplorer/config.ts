import {getLocation} from "../../hooks/getLocation";
import {triggerEvent} from "../../helpers/events";
import {createRoot} from "react-dom/client";
import Tooltip from "./Tooltip";
import React from "react";
import {storage} from "./api/storage";
import prettyBytes from "pretty-bytes";

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
    if (!dragArea) return;
    for (const item of dragArea.querySelectorAll('.custom-icon')) {
        if (item.querySelector('img')) {
            item.className = 'custom-icon custom-icon-img'
        }
    }
}

function initLayout() {
    const dragArea = document.querySelector('.fe_fileexplorer_items_wrap');
    dragArea.ondragstart = e => {
        const itemsAll = window.filemanager.GetCurrentFolder().GetEntries();
        const selected = window.filemanager.GetSelectedItemIDs().map(id => itemsAll.find(it => it.id === id));
        e.dataTransfer.setData('files', JSON.stringify(selected));
    }
    initItems();
}

function updateStorageSpace() {
    storage.getSpace().then(d => {
        const space = `Места занято: ${prettyBytes(d.used)} из ${prettyBytes(d.total)}`;
        window.filemanager.SetNamedStatusBarText('space', space);
    });
}

export function init() {
    let elem = document.querySelector('.filemanager');

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
        onrefresh: function(folder, required) {
            storage.listFiles(folder.GetPathIDs().slice(-1)[0]).then(data => {
                folder.SetEntries(data);
                initLayout();
                triggerEvent('filemanager:changeFolder');
                updateStorageSpace();
            })
        },
        onrename: function(renamed, folder, entry, newname) {
            storage.rename(entry.id, newname)
                .then(data => renamed(...data))
                .catch(er => renamed('Server/network error.'));
        },
        onnewfolder: function(created, folder) {
            storage.newFolder(folder.GetPathIDs().slice(-1)[0], 'New Folder')
                .then(data => created(data))
                .catch(() => created('Server/network error.'));
        },
        oncopy: function(copied, srcpath, srcids, destfolder) {
            driveRequest({
                request: {
                    method: 'POST',
                    parent: destfolder.GetPathIDs().slice(-1)[0],
                    action: 'copy',
                    elements: srcids,
                    data: {}
                },
                callback: (data) => {
                    copied(true, data);
                    updateStorageSpace();
                },
                error: () => {
                    copied(false, 'Server/network error.');
                },
            });
        },
        ondelete: function(deleted, folder, ids, entries, recycle) {
            driveRequest({
                request: {
                    method: 'DELETE',
                    elements: ids,
                    data: {},
                },
                callback: (data) => {
                    deleted(!!data.length);
                    options.onrefresh(folder);
                    updateStorageSpace();
                },
                error: () => {
                    deleted('Server/network error.');
                },
            });
        },
        onmove: function(moved, srcpath, srcids, destfolder) {
            driveRequest({
                request: {
                    method: 'POST',
                    parent: destfolder.GetPathIDs().slice(-1)[0],
                    action: 'move',
                    elements: srcids,
                    data: {}
                },
                callback: (data) => {
                    moved(true, data);
                },
                error: () => {
                    moved(false, 'Server/network error.');
                },
            });
        },
        oninitupload: function(startupload, fileinfo) {
            if (fileinfo.type === 'dir') return;
            const folder = fileinfo.folder.valueOf();
            let info = {...fileinfo};
            if (folder) info.folder = folder.GetPathIDs().slice(-1)[0];
            window.filemanager.SetNamedStatusBarText('message', fileinfo.file.name + ' Прогресс: 0%');
            uploadFile(info, () => {
                window.filemanager.SetNamedStatusBarText('message', 'Файл загружен!', 1000);
                updateStorageSpace();
                folder && setTimeout(() => {
                    options.onrefresh(folder);
                }, 500);
            });
        },
        oninitdownload: function(startdownload, folder, ids, entries) {
            console.log(ids)
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
    return new window.FileExplorer(elem, options);
}

export function initTooltip(ref, folder) {
    const wrapper = ref.current.querySelector('.fe_fileexplorer_items_scroll_wrap_inner');
    for (const item of folder) {
        let root = ref.current.querySelector(`.fe_fileexplorer_item_wrap[data-feid="${item.id}"]`);
        if (!root) continue;
        root = root.children[0];
        if (root.lastChild.classList.contains('filemanager-tooltip')) {
            root.removeChild(root.lastChild);
        }

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
}