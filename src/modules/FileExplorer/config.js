import {driveRequest, getMediaType, GoogleAPI, uploadFile} from "./api/google";
import {getLocation} from "../../hooks/getLocation";
import {triggerEvent} from "../../helpers/events";
import {createRoot} from "react-dom/client";
import Tooltip from "./Tooltip";
import React from "react";

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
    let apiSession = new GoogleAPI({method:"GET"}, {});
    apiSession.sendRequest('https://www.googleapis.com/drive/v2/about').then(d => {
        const f = (size) => window.filemanager.GetDisplayFilesize(size);
        const space = `Места занято: ${f(+d.quotaBytesUsed)} из ${f(+d.quotaBytesTotal)}`;
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
            driveRequest({
                request: {
                    method: 'GET',
                    action: 'list',
                    elements: [folder.GetPathIDs().slice(-1)[0]],
                    data: {},
                },
                callback: (data) => {
                    folder.SetEntries(data);
                    initLayout();
                    triggerEvent('filemanager:changeFolder');
                    updateStorageSpace();
                },
            });
        },
        onrename: function(renamed, folder, entry, newname) {
            driveRequest({
                request: {
                    method: 'PATCH',
                    elements: [entry.id],
                    data: {
                        title: newname,
                    }
                },
                callback: (data) => {
                    renamed(...data);
                },
                error: () => {
                    renamed('Server/network error.');
                },
            });
        },
        onnewfolder: function(created, folder) {
            driveRequest({
                request: {
                    method: 'POST',
                    parent: folder.GetPathIDs().slice(-1)[0],
                    action: 'new folder',
                    data: {
                        name: 'New Folder',
                    }
                },
                callback: (data) => {
                    created(...data);
                },
                error: () => {
                    created('Server/network error.');
                },
            });
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
                callback: () => {
                    deleted(true);
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
            console.log(fileinfo)
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