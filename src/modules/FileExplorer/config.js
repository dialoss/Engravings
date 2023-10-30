import {initLayout} from "./FileExplorer";
import {driveRequest, getMediaType} from "./api/google";
import {getLocation} from "../../hooks/getLocation";

export function init() {
    let elem = document.getElementById('filemanager');

    let options = {
        tools: {
            item_checkboxes: true
        },
        initpath: [
            [ '', 'Mymount (/)', { canmodify: true } ]
        ],
        onopenfile: function(folder, entry) {
            if (entry.type === 'folder') return;
            let url = "https://drive.google.com/uc?id=" + entry.id;
            window.open(url, "_blank");
        },
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
            let parent = '';
            if (fileinfo.folder) parent = fileinfo.folder.GetPathIDs().slice(-1)[0];
            else {
                let path = getLocation().relativeURL.slice(1, -1).split('/');
                let folderName = getMediaType(fileinfo.file.name) + 's';
                await driveRequest({
                    request: {
                        method: 'POST',
                        parent: '',
                        action: 'create folder with path',
                        data: {
                            path,
                            name: folderName,
                        }
                    },
                    callback: (folder) => parent = folder[0].id
                });
            }
            let uploadedFile = null;
            await driveRequest({
                request: {
                    method: 'POST',
                    parent,
                    action: 'upload',
                    data: {
                        file: fileinfo.file,
                    }
                },
                callback: (entry) => {
                    window.filemanager.SetNamedStatusBarText('message', 'Файл загружен!', 1000);
                    fileinfo.folder && setTimeout(() => {
                        options.onrefresh(fileinfo.folder);
                    }, 500);
                    uploadedFile = entry[0];
                },
                error: () => {
                    console.log('Server/network error.');
                },
            });
            return uploadedFile;
        },
        ondownloadurl: function(result, folder, ids, entry) {
            result.name = entry.name;
            result.url = 'https://drive.google.com/uc?id=' + ids.slice(-1)[0];
        },
    };

    return new window.FileExplorer(elem, options);
}