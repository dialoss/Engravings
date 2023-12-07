import Credentials from "../../Authorization/api/googleapi";
import dayjs from "dayjs";
import {getElementByType, triggerEvent} from "../../../helpers/events";
import {getLocation} from "../../../hooks/getLocation";
import {EmptyStorageFile, getFileType, GoogleDriveAPI, StorageAPI, StorageFile} from "./google";
import {uploadAutodeskFile} from "../../../components/Item/components/Model/Autodesk/api/api";
import {MediaDimensions} from "../helpers";


export interface IAppStorage {
    storageAPI: StorageAPI,
    listFiles(folder : StorageFile) : Promise<StorageFile[]>;
    getFile(id: string) : Promise<StorageFile>;
    copy(file : StorageFile);
    move(file : StorageFile);
    rename(file : StorageFile);
    delete(files : StorageFile[]);
    uploadFile(file: File, path: string[], callback);
    getSpace(): Promise<StorageSpace>;
}

export class AppStorage implements IAppStorage {
    storageAPI = new GoogleDriveAPI();

    newFile(path: string[], file: StorageFile) {
        return this.storageAPI.post(false, file);
    }

    async newFolderWithPath(path: string[]) {
        let folderID = '';
        let nextFolder : EmptyStorageFile = {parent:'', name:'', mimeType:'folder'};
        let folderData : StorageFile;
        for (const f of path) {
            nextFolder.parent = '12dZHb2PW4UfLePKrEZnYAikZpoQqSPVb';
            nextFolder.name = f;
            folderData = (await this.storageAPI.post(true, nextFolder))[0];
            folderID = folderData.id;
        }
        return folderData;
    }

    listFiles(folder: StorageFile) {
        return this.storageAPI.list(folder);
    }

    delete(files : StorageFile[]) {
        return new Promise((resolve) => {
            triggerEvent('user-prompt', {title: "Подтвердить удаление", button: 'ок', submitCallback: async (submit) => {
                    if (!!submit) {
                        let removedFiles = [];
                        for (const f of files) {
                            removedFiles.push(this.storageAPI.delete(f));
                        }
                        new Promise.all(removedFiles).then(data => resolve(data));
                    }
                    else resolve([]);
                }});
        });
    }

    async uploadFile(file: File, path: string[], callback) {
        if (!path.length) path = ['site', 'storage', getLocation().pageSlug];
        let props = {};
        if (getFileType(file.name).match(/image|video/)) {
            props = await new MediaDimensions(file).get();
        }
        if (getFileType(file.name).match(/model/)) {
            let urn = await uploadAutodeskFile(file);
            props = {
                modelurn1: urn.slice(0, urn.length / 2),
                modelurn2: urn.slice(urn.length / 2),
            }
        }
        file.props = props;
        file.parent = (await this.newFolderWithPath(path)).id;
        this.storageAPI.put(file, callback);
    }

    getSpace(): Promise<StorageSpace> {
        return this.storageAPI.requests.request('https://www.googleapis.com/drive/v2/about', {method: "GET"}).then(data => ({
            used: +data.quotaBytesUsed,
            total: +data.quotaBytesTotal,
        }));
    }

    getFile(id: string) {
        return this.storageAPI.get(id)[0];
    }

    copy(file: StorageFile) {
    }
    rename(file: StorageFile) {
    }
    move(file: StorageFile) {
    }

    transferFiles(event, callback) {
        for (const file of FileTransfer.getFiles(event)) {
            // this.uploadFile(file, callback);
        }
    }
}

interface StorageSpace {
    used: number,
    total: number,
}

export const storage = new AppStorage();

class FileTransfer {
    static get(event: ClipboardEvent): File[] {
        return [...event.clipboardData.files];
    }
    static get(event: DragEvent): File[] {
        return [...(JSON.parse(event.dataTransfer.getData('files') || "[]")), ...event.dataTransfer.files];
    }
    static get(event: React.ChangeEvent<HTMLInputElement>): File[] {
        return [...event.target.files];
    }
    static getFiles(event: any): File[] {
        const files = FileTransfer.get(event);
        if (files.length) {
            event.stopPropagation();
            event.preventDefault();
        }
        return files;
    }
}
