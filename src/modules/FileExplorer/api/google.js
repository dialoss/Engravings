import {uploadAutodeskFile} from "../../../ui/Viewer";
import Credentials from "../../Authorization/api/googleapi";
import dayjs from "dayjs";
import {triggerEvent} from "../../../helpers/events";

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
            console.log(urn)
            props = {
                modelurn1: urn.slice(0, urn.length / 2),
                modelurn2: urn.slice(urn.length / 2),
            }
        }
        console.log(this.request)
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
                triggerEvent('user-prompt', {title: "Подтвердить удаление", button: 'ок', windowButton:true, submitCallback: () => {
                    resolve(apiSession.deleteElements());
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
    let props = (file.properties || [{}]);
    let urn = '';
    for (const prop of props.reverse())
        urn += prop.value || '';

    return {
        'id': id,
        'name': file.title || file.name || '',
        'type': type,
        'size': +file.fileSize || 0,
        'hash': id + (new Date().getTime()),
        'thumb': thumb,
        'url': "https://drive.google.com/uc?id=" + id,
        'urn': urn,
        'filetype': fileType,
        'modifiedTime': dayjs(file.modifiedDate).format("HH:mm DD.MM.YYYY"),
    };
}

export async function driveRequest({request, callback, error}) {
    token = await Credentials.getToken();
    try {
        return Promise.all(await apiMapper(request))
            .then(response => {
                if (!response[0]) return;
                let items = response[0].items || [response[0]];
                if (!items) {
                    callback([]);
                    return;
                }
                callback(Object.values(items).map(file => serializeFile(file)));
            }).catch(e => {
                error && error(e);
                console.log(e)
            });
    } catch (e) {
        error && error(e);
        console.log(e)
    }
}

export function getMediaType(filename) {
    const types = {
        'image': ['png', 'jpeg', 'jpg', 'webp'],
        'model': ['sldprt', 'sld', 'sldw', 'sldasm', 'sdas', 'glb', 'gltf'],
        'video': ['mp4', 'mkv', 'matroska', 'avi'],
    };
    for (const type in types) {
        for (const ext of types[type]) {
            if (filename.toLowerCase().includes(ext)) return type;
        }
    }
    return 'file';
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
    let uploadedFile = null;
    await driveRequest({
        request: {
            method: 'POST',
            parent,
            action: 'upload',
            data: {
                file,
            }},
        callback: (entry) => {
            callback && callback();
            uploadedFile = entry[0];
        },
    });
    return uploadedFile;
}


function compress(file) {
    return new Promise((resolve) => {
        let oldWidth, oldHeight, newHeight, newWidth, canvas, ctx, newDataUrl;
        let imageType = "image/jpeg";
        const ratio = 0.6;

        const reader = new FileReader();

        reader.addEventListener(
            "load",
            () => {
                let image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    oldWidth = image.width;
                    oldHeight = image.height;
                    newWidth = oldWidth * ratio;
                    newHeight = oldHeight * ratio;
                    canvas = document.createElement("canvas");
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, newWidth, newHeight);
                    newDataUrl = canvas.toDataURL(imageType, ratio);
                    let blobBin = atob(newDataUrl.split(',')[1]);
                    let array = [];
                    for (let i = 0; i < blobBin.length; i++) {
                        array.push(blobBin.charCodeAt(i));
                    }
                    resolve(new Blob([new Uint8Array(array)], {type: imageType}));
                }
            },
            false,
        );

        reader.readAsDataURL(file);
    });
}
