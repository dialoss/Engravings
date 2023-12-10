//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {ReactComponent as Attachment} from '../Message/assets/attachment.svg';
import {ReactComponent as Send} from '../Message/assets/send.svg';
import "./MessengerInput.scss";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {ModalManager} from "../../ModalManager";
import {triggerEvent} from "../../../helpers/events";
import TransformItem from "../../../ui/ObjectTransform/components/TransformItem/TransformItem";
import {storage} from "../../../modules/FileExplorer/api/storage";

export const InputAttachment = ({callback}) => {
    const inputRef = useRef();
    return (
        <div className="icon icon-attachment" onClick={() => inputRef.current.click()}>
            <input multiple={true} type="file" hidden ref={inputRef}
                   onChange={(e) => callback({upload: Object.values(e.target.files)})}/>
            <Attachment></Attachment>
        </div>
    );
}

export const AttachmentPreview = ({message}) => {
    return (
        <>
            {!!message.upload.length &&
                <div className={"uploads"}>
                    {
                        message.upload.map(u => <p key={u.name}>{u.name}</p>)
                    }
                </div>
            }
        </>
    )
}

export const InputSend = ({callback}) => {
    return (
        <div className="ql-toolbar input-send">
            <div className="ql-formats">
                <div className="icon icon-send" onClick={callback}>
                    <Send></Send>
                </div>
            </div>
        </div>

    );
}

export const InputEmoji = ({callback}) => {
    const modalName = useRef<string>('');
    if (!modalName.current) modalName.current = `emojis-window` + new Date().getTime();
    useEffect(() => {
        let sheet = new CSSStyleSheet;
        sheet.replaceSync(`
        :host {
            .scroll {
                overflow-x: auto;
                overscroll-behavior: none;
            } 
        }
        .scroll {
                overflow-x: auto;
                overscroll-behavior: none;
            }
        #preview {
            display: none;
        }
        `);
        let root = ref.current.querySelector('em-emoji-picker');
        root.shadowRoot.adoptedStyleSheets.push(sheet);
    }, [])

    const [position, setPosition] = useState({left: 0, top: 0});
    const ref = useRef();
    function open() {
        window.modals.toggle(modalName.current);
        const height = ref.current.querySelector('.transform-item').getBoundingClientRect().height;
        setPosition({left: 0, top: -height - 10 + 'px'});
    }

    return (
        <div className={"icon icon-emojis"} ref={ref}>
            <p className={'modal__toggle-button'} onClick={open}>😃</p>
                <ModalManager style={{bg:'bg-none'}}
                              name={modalName.current}
                              closeConditions={['btn', 'esc', 'bg']}>
                    <TransformItem style={{position:'fixed', width:'auto', ...position}}
                                   data-type={'modal'} className={modalName.current}>
                        <Picker icons={'solid'}
                                data={data}
                                onEmojiSelect={(e) => callback(e.native)}/>
                    </TransformItem>
                </ModalManager>
        </div>
    );
}

export const CustomUpload = ({children, name, inputCallback}) => {
    const upload = (e, callback) => storage.uploadFile(e, files => callback(m => ({...m, upload:files})), false);
    return (
        <div className={"custom-input " + name}
             onDragOver={(e) => e.preventDefault()}
             onDrop={e => upload(e, inputCallback)}
             onPaste={e => upload(e, inputCallback)}>
            {children}
        </div>
    );
}

const MessengerInput = ({inputCallback, message, sendCallback}) => {
    return (
        <CustomUpload name={'messenger-input'} inputCallback={inputCallback}>
            <div className={"input-field"}>
                <div className="editor-wrapper">
                    <TextEditor message={message}
                                callback={inputCallback}
                                config={'simple'}></TextEditor>
                </div>
            </div>
            <AttachmentPreview message={message}></AttachmentPreview>
            <InputSend callback={sendCallback} key={'messenger-send'}></InputSend>
        </CustomUpload>
    );
};

export default MessengerInput;