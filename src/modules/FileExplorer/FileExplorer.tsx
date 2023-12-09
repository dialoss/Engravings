import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./file-explorer/file-explorer.css";
import "./file-explorer/file-explorer";
import {changeUploadStatus, ExplorerViews, init, initItems, TextBar} from "./config";
import "./Custom.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {ModalManager} from "../../components/ModalManager";
import {useAddEvent} from "../../hooks/useAddEvent";
import TransformItem from "../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {ImageEditor} from "./ImageEditor/ImageEditor";
import WindowButton from "../../ui/Buttons/WindowButton/WindowButton";
import {useAppSelector} from "hooks/redux";
import {storage} from "./api/storage";
import Toolbar from "./components/Toolbar";
import {useAppSelector} from "../../hooks/redux";

const FileExplorer = () => {
    const location = useAppSelector(state => state.location);
    useLayoutEffect(() => {
        init();
        window.filemanager.changeFolder = () => {
            if (window.filemanager.fromSearch) {
                window.filemanager.fromSearch = false;
                return;
            }
            const f = window.filemanager.GetCurrentFolder();
            setFolder(f.GetEntries());
        };
        window.filemanager.open = () => document.querySelector("#filemanager-local").click();
    }, []);

    useEffect(() => {
        if (!window.modals.checkState("filemanager")) {
            console.log(location)
            storage.newFolderWithPath(['site', 'storage', location.pageSlug]).then(folder =>
                    window.filemanager.SetPath([...window.filemanager.settings.initpath,
                        [ folder.id, folder.name, { canmodify: true } ]])
            )
        }
    }, [location]);

    const [folder, setFolder] = useState([]);

    useAddEvent("filemanager:select", e => {
        window.filemanager.selectItems = e.detail.callback;
        window.modals.open("filemanager");
    });

    useLayoutEffect(() => {
        if (!window.filemanager.GetCurrentFolder) return;
        window.filemanager.GetCurrentFolder().SetEntries(folder);
        initItems();
    }, [folder]);

    return (
        <ModalManager name={"filemanager"}
                      style={{bg:'bg-none', win: isMobileDevice() ? 'bottom': ''}}
                      closeConditions={['btn', 'esc']}>
            <TransformItem style={isMobileDevice() ? {} : {position:'fixed', left:'20%', top:'100px', height:'600px', width:'800px'}}
                           className={'edit'}
                           type={'modal'}>
                <div className={"filemanager"}>
                    <div className="filemanager-left">
                        <div className={"filemanager-header__wrapper"}>
                            <div className="filemanager-header buttons transform-origin">
                                <WindowButton type={'close'}></WindowButton>
                                <Toolbar data={folder} setData={setFolder}></Toolbar>
                            </div>
                        </div>
                    </div>
                    <div className="filemanager-right">
                        <ImageEditor></ImageEditor>
                        <input type="file"
                               multiple={true}
                               style={{display:'none'}}
                               onChange={e => storage.transferFiles(e, changeUploadStatus)}
                               id={"filemanager-local"}/>
                    </div>
                </div>
            </TransformItem>
        </ModalManager>
    );
};

export default FileExplorer;
