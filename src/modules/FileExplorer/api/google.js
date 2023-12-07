import Credentials from "../../Authorization/api/googleapi";
import dayjs from "dayjs";
import {getElementByType, triggerEvent} from "../../../helpers/events";
import {fileToItem, getMediaDimensions} from "../helpers";
import "./upload";
import {getLocation} from "../../../hooks/getLocation";
import {uploadAutodeskFile} from "../../../components/Item/components/Model/Autodesk/api/api";
import axios from 'axios'

const BASE_URL = "https://www.googleapis.com/drive/v2/files/";
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files/";
const ROOT_FOLDER = '12dZHb2PW4UfLePKrEZnYAikZpoQqSPVb';
let token ='';

export class GoogleAPI {
    request = null;
    data = null;

    constructor(request, data) {
        this.request = request;
        this.data = data;
    }

    sendRequest(query, data={}, headers={}) {
        let body = {};
        if (Object.values(data).length) body = {body: JSON.stringify(data)};
        return fetch(query, {
            method: this.request.method,
            headers: {
                "Authorization": "Bearer " + token,
                ...headers,
            },
            ...body,
        }).then(r => {
            if (r.status === 200) return r.json();
        }).then(data => data);
    }

    listFiles() {
        let id = this.request.elements[0];
        let q = BASE_URL + `?q='${id || ROOT_FOLDER}'+in+parents and trashed=false`;
        return [this.sendRequest(q)];
    }

    updateElement() {
        return [this.sendRequest(BASE_URL + this.request.elements[0] + '/', this.data)];
    }

    getFile() {
        let id = this.request.elements[0];
        return [this.sendRequest(BASE_URL + id)];
    }

    async createFolder(unique, parent='', name='') {
        if (unique) {
            this.request.method = 'GET';
            let q = BASE_URL + `?q='${parent || ROOT_FOLDER}'+in+parents and trashed=false and mimeType='application/vnd.google-apps.folder'`;
            for (const f of (await this.sendRequest(q)).items) {
                if (f.title === name) return f;
            }
        }
        this.request.method = 'POST';
        return await this.sendRequest(BASE_URL, {
            parents: [{
                id: parent || this.request.parent || ROOT_FOLDER,
            }],
            title: name || this.data.name,
            kind:'drive#file',
            mimeType: 'application/vnd.google-apps.folder'
        });
    }

    copyElements() {
        let response = [];
        let parent = this.request.parent;
        let q = `?q='${parent || ROOT_FOLDER}'+in+parents`;
        for (const el of this.request.elements) {
            response.push(this.sendRequest(BASE_URL + el + '/copy' + q));
        }
        return response;
    }

    deleteElements() {
        let response = [];
        for (const el of this.request.elements) {
            response.push(this.sendRequest(BASE_URL + el));
        }
        return response;
    }
    async uploadFile(file) {
        let location = '';
        const config = {
            onUploadProgress: event => console.log(event.progress * 100 + '%'),
            headers: {
                "Content-Range": `bytes 0-${file.size - 1}\/${file.size}`,
                'X-Upload-Content-Type': file.type,
            },
        };
        token = await Credentials.getToken()
        return [axios.post(UPLOAD_URL + "?uploadType=resumable", {
                parents: [ROOT_FOLDER],
                name: file.name,
                mimeType: file.type,
            }, {headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json; charset=UTF-8',
        }}).then(r => {
            location = r.headers.get('Location');
            return axios.put(location, file, config).then(data => data).catch(e => console.log(e));
        })];
    }
}
async function apiMapper(request) {
    let apiSession = new GoogleAPI(request, request.data);
    switch (request.method) {
        case "GET":
            switch (request.action) {
                case 'list':
                    return apiSession.listFiles();
                case 'file':
                    return apiSession.getFile();
            }
        case "POST":
            switch (request.action) {
                case "new folder":
                    return [await apiSession.createFolder(false)];
                case "copy":
                    return apiSession.copyElements();
                case "move":
                    let entries = apiSession.copyElements();
                    apiSession.deleteElements();
                    return entries;
                case 'create folder with path':
                    let folderID = ROOT_FOLDER;
                    let folderData = null;
                    for (const f of [...request.data.path]) {
                        folderData = (await apiSession.createFolder(true, folderID, f));
                        folderID = folderData.id;
                    }
                    return [folderData];
            }
            return [];
        case "PATCH":
            return apiSession.updateElement();
        case "DELETE":
            return new Promise((resolve) => {
                triggerEvent('user-prompt', {title: "Подтвердить удаление", button: 'ок', submitCallback: (submit) => {
                    if (!!submit) resolve(apiSession.deleteElements());
                    else resolve([]);
                }});
            });
    }
}

export function serializeFile(file) {
    let type = file.mimeType.split('.').slice(-1)[0];
    let thumb = '';
    let id = file.id || '';
    if (type !== 'folder') {
        thumb = file.thumbnailLink || "https://drive.google.com/uc?id=" + id;
        type = 'file';
    }
    let fileType = getMediaType(file.mimeType);
    let props = (file.properties || []);
    let urn = '';
    let [width, height] = ['', ''];
    for (const prop of props.reverse()) {
        if (prop.key.includes('urn')) urn += prop.value || '';
        if (prop.key === 'width') width = prop.value;
        if (prop.key === 'height') height = prop.value;
    }

    return {
        'id': id,
        'name': file.title || file.name || '',
        'type': type,
        'size': +file.fileSize || 0,
        'hash': id + (new Date().getTime()),
        'thumb': thumb,
        'url': "https://drive.google.com/uc?id=" + id,
        'urn': urn,
        width,
        height,
        'filetype': fileType,
        'modifiedTime': dayjs(file.modifiedDate).format("HH:mm DD.MM.YYYY"),
    };
}

export async function driveRequest({request, callback, error}) {
    token = await Credentials.getToken();
    console.log({token})
    try {
        return Promise.all(await apiMapper(request))
            .then(response => {
                if (!response[0]) {
                    callback([]);
                    return;
                }
                let items = response[0].items || [response[0]];
                if (!items) {
                    callback([]);
                    return;
                }
                callback(Object.values(items).map(file => serializeFile(file)));
            }).catch(e => {
                error && error(e);
            });
    } catch (e) {
        error && error(e);
    }
}

export function getMediaType(filename) {
    const types = {
        'image': ['png', 'jpeg', 'jpg', 'webp', 'gif', 'image'],
        'model': ['sldprt', 'sld', 'sldw', 'sldasm', 'sdas', 'glb', 'gltf'],
        'video': ['mp4', 'mkv', 'matroska', 'avi', 'mov', 'video'],
        'table': ['sheet'],
        'folder': ['folder'],
    };
    for (const type in types) {
        for (const ext of types[type]) {
            if (filename.toLowerCase().includes(ext)) return type;
        }
    }
    return 'file';
}

export async function getFile(id) {
    let file = null;
    await driveRequest({
        request: {
            method: 'GET',
            action: 'file',
            elements: [id],
            data: {},
        },
        callback: (data) => {
            file = data[0];
        },
    });
    return file;
}

export async function uploadFile(fileinfo, callback) {
    let parent = '';
    if (fileinfo.folder !== undefined) parent = fileinfo.folder || ROOT_FOLDER;
    else {
        await driveRequest({
            request: {
                method: 'POST',
                parent: '',
                action: 'create folder with path',
                data: {
                    path: fileinfo.path,
                }},
            callback: (folder) => parent = folder[0].id
        });
    }
    let file = fileinfo.file;
    let uploadedFile = await testUpload(file, parent);
    uploadedFile = await getFile(uploadedFile.id);
    callback && callback();
    return uploadedFile;
}


export async function testUpload(file, folder) {
    let props = await getMediaDimensions(file);

    if (getMediaType(file.name) === 'model') {
        let urn = await uploadAutodeskFile(file);
        props = {
            ...props,
            modelurn1: urn.slice(0, urn.length / 2),
            modelurn2: urn.slice(urn.length / 2),
        }
    }

    token = await Credentials.getToken();
    let fr = new FileReader();
    fr.fileName = file.name;
    fr.fileSize = file.size;
    fr.fileType = file.type;
    fr.readAsArrayBuffer(file);
    return await new Promise((resolve) => {
        fr.onload = () => {
            const resource = {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                fileBuffer: fr.result,
                accessToken: token,
                folderId: folder,
                properties: props,
            };
            const ru = new window.ResumableUploadToGoogleDrive();
            ru.Do(resource, function (res, err) {
                if (err) {
                    triggerEvent('alert:trigger', {type:'error', body: err});
                    return;
                }
                let msg = '';
                if (res.status === "Uploading") {
                    msg =
                        Math.round(
                            (res.progressNumber.current / res.progressNumber.end) * 100
                        ) + "%";
                }
                if (res.status === 'Done') {
                    resolve(res.result);
                    msg = 'Файл загружен!';
                }
                if (file.msg_id) {
                    document.querySelector(`div[data-id='${file.msg_id}']`).
                    querySelectorAll('.text-loader')[file.index].querySelector('.progress').innerHTML = msg;
                }
                window.filemanager && window.filemanager.SetNamedStatusBarText('message', ' Прогресс: ' + msg + ' ' + file.name);
            });
        }
    });
}

export async function storageUpload(e, callback, uploadToDrive=true) {
    let files = [];
    for (const file of [...(e.dataTransfer || e.clipboardData || e.target).files]) {
        if (uploadToDrive) {
            let data = await uploadFile({file, path:['site', 'storage', getLocation().pageSlug]});
            const f = fileToItem({...data, type: data.filetype, filename: data.name});
            files = [...files, f];
        } else {
            files = [...files, file];
        }
    }
    if (e.dataTransfer)
        for (const file of (JSON.parse(e.dataTransfer.getData('files') || "[]"))) {
            files.push(fileToItem({...file, type: file.filetype}));
        }
    callback(files);
    if (files.length) {
        e.stopPropagation();
        e.preventDefault();
    }
}

export async function itemMediaUpload(e) {
    if (getElementByType(e, 'modal')) return;
    storageUpload(e, files => {
        triggerEvent("action:callback", files);
    })
}