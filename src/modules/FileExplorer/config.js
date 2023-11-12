import {driveRequest, getMediaType, uploadFile} from "./api/google";
import {getLocation} from "../../hooks/getLocation";
import {triggerEvent} from "../../helpers/events";
import {createRoot} from "react-dom/client";
import Tooltip from "./Tooltip";
import React from "react";
import {upload} from "@testing-library/user-event/dist/upload";

export const ExplorerViews = ['default', 'list'];
export const TextBar = [
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

function initLayout() {
    let items = document.querySelectorAll('.fe_fileexplorer_item_wrap_inner');
    for (const item of items) {
        item.ondragstart = e => {
            let wrapper = item.closest('.fe_fileexplorer_item_wrap');
            let model = item.getAttribute('data-model');
            e.dataTransfer.setData('files', JSON.stringify([{
                id: wrapper.getAttribute('data-feid'),
                urn: model,
                type: item.getAttribute('data-itemtype'),
                name: item.getAttribute('data-itemname'),
            }]));
        };
    }
}


export function init() {
    let elem = document.getElementById('filemanager');

    let options = {
        tools: {
            item_checkboxes: true
        },
        initpath: [
            [ '', 'Mymount (/)', { canmodify: true } ]
        ],
        onrefresh: function(folder, required) {
            driveRequest({
                request: {
                    method: 'GET',
                    elements: [folder.GetPathIDs().slice(-1)[0]],
                    data: {},
                },
                callback: (data) => {
                    folder.SetEntries(data);
                    initLayout();
                    triggerEvent('filemanager:changeFolder');
                },
                error: () => {
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
                    deleted(true);
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
        oninitupload: async function(startupload, fileinfo) {
            if (fileinfo.type === 'dir') return;
            let info = fileinfo;
            if (fileinfo.folder) info.folder = fileinfo.folder.GetPathIDs().slice(-1)[0];
            return await uploadFile(info, () => {
                window.filemanager.SetNamedStatusBarText('message', 'Файл загружен!', 1000);
                fileinfo.folder && setTimeout(() => {
                    options.onrefresh(fileinfo.folder);
                }, 500);
            });
        },
        ondownloadurl: function(result, folder, ids, entry) {
            result.name = entry.name;
            result.url = 'https://drive.google.com/uc?id=' + ids.slice(-1)[0];
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