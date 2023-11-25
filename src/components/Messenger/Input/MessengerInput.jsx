import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {ReactComponent as Attachment} from '../Message/assets/attachment.svg';
import {ReactComponent as Send} from '../Message/assets/send.svg';
import "./MessengerInput.scss";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {ModalManager} from "../../ModalManager";
import {triggerEvent} from "../../../helpers/events";
import {dropUpload} from "../../../modules/FileExplorer/api/google";

export const InputAttachment = ({callback}) => {
    const inputRef = useRef();
    return (
        <div className="icon icon-attachment" onClick={() => inputRef.current.click()}>
            <input type="file" hidden ref={inputRef}
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
    useEffect(() => {
        let sheet = new CSSStyleSheet;
        sheet.replaceSync(`
        :host {
            .scroll {
                overflow-x: auto;
            } 
        }
        .scroll {
                overflow-x: auto;
            }
        #preview {
            display: none;
        }
        `);
        let root = document.querySelector('em-emoji-picker');
        root.shadowRoot.adoptedStyleSheets.push(sheet);
    }, [])
    const modalName = `emojis-window` + new Date().getTime();

    return (
        <div className={"icon icon-emojis"}>
            <p className={'modal__toggle-button'} onClick={() => triggerEvent(modalName + ":toggle", {toggle:true})}>😃</p>
            <ModalManager name={modalName} closeConditions={['bg', 'esc']}>
                <Picker style={{bg:'bg-none'}}
                        icons={'solid'}
                        data={data}
                        onEmojiSelect={(e) => callback(e.native)}/>
            </ModalManager>
        </div>
    );
}

export const CustomUpload = ({children, name, inputCallback}) => {
    const upload = (e, callback) => dropUpload(e, files => callback(m => ({...m, upload:files})), false);
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