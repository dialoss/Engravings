import {uploadAutodeskFile} from "../../../ui/Viewer";
import Credentials from "../../Authorization/api/googleapi";
import dayjs from "dayjs";

const BASE_URL = "https://www.googleapis.com/drive/v2/files/";
const UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files/";
let token = '';
const ROOT_FOLDER = '1KlLCb36NwgGql3grcNAf4pXkH9SKBKEj';

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
        }).then(r => r.json()).then(data => data).catch(e => console.log(e));
    }

    listFiles() {
        let id = this.request.elements[0];
        let q = BASE_URL + `?q='${id || ROOT_FOLDER}'+in+parents and trashed=false`;
        return [this.sendRequest(q)];
    }

    updateElement() {
        return [this.sendRequest(BASE_URL + this.request.elements[0] + '/', this.data)];
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

    async uploadFile(file) {
        let props = {};
        if (['sldprt', 'sldasm'].includes(file.name.split('.').slice(-1)[0].toLowerCase())) {
            let urn = await uploadAutodeskFile(file);
            props = {
                modelurn: urn,
            }
        }
        let location = '';
        return [fetch(UPLOAD_URL + "?uploadType=resumable", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                parents: [this.request.parent],
                name: file.name,
                mimeType: file.type,
                properties: props,
            })
        }).then(r => {
            location = r.headers.get('Location');
            return fetch(location, {
                method: "PUT",
                headers: {
                    "Content-Range": `bytes 0-${file.size - 1}\/${file.size}`,
                    'X-Upload-Content-Type': file.type,
                },
                body: file,
            }).then(r => r.json()).then(data => data).catch(e => console.log(e));
        })];
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
}
async function apiMapper(request) {
    let apiSession = new GoogleAPI(request, request.data);
    switch (request.method) {
        case "GET":
            return apiSession.listFiles();
        case "POST":
            switch (request.action) {
                case "new folder":
                    return [await apiSession.createFolder(false)];
                case "upload":
                    window.filemanager.SetNamedStatusBarText('message', 'Файл выгружается...', 1000000);
                    return await apiSession.uploadFile(request.data.file);
                case "copy":
                    return apiSession.copyElements();
                case "move":
                    let entries = apiSession.copyElements();
                    apiSession.deleteElements();
                    return entries;
                case 'create folder with path':
                    let folderID = ROOT_FOLDER;
                    let folderData = null;
                    for (const f of [...request.data.path, request.data.name]) {
                        folderData = (await apiSession.createFolder(true, folderID, f));
                        folderID = folderData.id;
                    }
                    return [folderData];
            }
            return [];
        case "PATCH":
            return apiSession.updateElement();
        case "DELETE":
            return apiSession.deleteElements();
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
    let props = (file.properties || [{}])[0].value || '';
    return {
        'id': id,
        'name': file.title || file.name || '',
        'type': type,
        'size': +file.fileSize || 0,
        'hash': id + (new Date().getTime()),
        'thumb': thumb,
        'urn': props,
        'filetype': fileType,
        'modifiedTime': dayjs(file.modifiedDate).format("HH:mm DD.MM.YYYY"),
    };
}

export async function driveRequest({request, callback, error}) {
    token = await Credentials.getToken();
    let rawResponse = [];
    try {
        rawResponse = await apiMapper(request);
    } catch (e) {error(e)}
    return Promise.all(rawResponse)
        .then(response => {
            if (!response[0]) return;
            let items = response[0].items || [response[0]];
            if (!items) {
                callback([]);
                return;
            }
            callback(Object.values(items).map(file => serializeFile(file)));
        });
}

export function getMediaType(filename) {
    const types = {
        'image': ['png', 'jpeg', 'jpg', 'webp'],
        'model': ['sldprt', 'sld', 'sldw', 'sldasm', 'sdas', 'glb', 'gltf'],
        'video': ['mp4', 'mkv', 'matroska'],
    };
    for (const type in types) {
        for (const ext of types[type]) {
            if (filename.includes(ext)) return type;
        }
    }
    return 'file';
}

