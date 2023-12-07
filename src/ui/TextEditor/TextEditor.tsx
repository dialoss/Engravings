import React, {useEffect, useLayoutEffect, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {configQuill, QuillModules} from "./config";
import "./TextEditor.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";
import {createRoot} from "react-dom/client";
import {InputAttachment, InputEmoji} from "../../components/Messenger/Input/MessengerInput";

configQuill();

const TextEditor = React.forwardRef(function TextEditor({config, message, callback}, ref) {
    const msgRef = useRef();
    const clickEvent = useRef();

    useAddEvent("mousedown", (e) => {
        clickEvent.current = e;
    })
    const simple = config === 'simple';

    useEffect(() => {
        if(!msgRef.current) return;
        let root = msgRef.current.getEditor();
        simple && root.keyboard.bindings[13].unshift({
            key: 13,
            handler: (range,context) => {
            }
        })
        let field = root.root;

        isMobileDevice() && field.addEventListener('focus', e => {
             triggerEvent("messenger:scroll");
        });

        field.addEventListener('mousedown', e => {
            e.stopPropagation()
        });

        field.dataset.placeholder = 'Сообщение';
        field.addEventListener('keydown', (e) => e.stopPropagation());
        field.focus();
        if (simple) {
            field.addEventListener('blur', (e) => {
                let target = getElementFromCursor(clickEvent.current, '', ['icon-emojis', 'emojis-window']);
                if (target) {
                    e.preventDefault();
                    field.focus();
                }
            });
            field.addEventListener('keydown', (e) => triggerEvent('messenger:keydown', e));
        }
        const toolbar = field.closest('.quill').querySelector('.ql-toolbar');
        createRoot(toolbar.querySelector('.ql-emoji')).render(
            <InputEmoji callback={(v) => {
                const quill = (ref && ref.current || msgRef && msgRef.current).getEditor();
                let range = quill.getSelection();
                let position = range ? range.index : 0;
                quill.insertText(position, v);
            }}></InputEmoji>);
        createRoot(toolbar.querySelector('.ql-attachment')).render(
            <InputAttachment callback={(v) => callback(m => ({...m, upload:v.upload}))}></InputAttachment>);
    }, []);

    useEffect(() => {
        if(!ref || !ref.current) return;
        let root = ref.current.getEditor();
        for (const picker of [...root.container.closest('.quill').querySelectorAll('.ql-picker')]) {
            const options = picker.querySelector('.ql-picker-options');
            picker.addEventListener('click', e => {
                options.style.left = picker.offsetLeft + 'px';
                options.style.top = picker.offsetTop + picker.getBoundingClientRect().height + 'px'
                options.style.position = 'fixed';
            })
        }
    }, []);

    function inputCallback(value) {
        callback(m => ({...m, text:value}));
        if (simple && msgRef.current) {
            let field = msgRef.current.getEditor();
            let inputHeight = field.root.querySelector('p').getBoundingClientRect().height;
            field.container.style.height = Math.max(Math.min(300, inputHeight), 50) + 'px';
        }
    }

    const modules = QuillModules[config];

    return (
            <ReactQuill className={"ql-" + config}
                        ref={ref || msgRef}
                        theme="snow"
                        value={message.text}
                        onChange={inputCallback}
                        modules={modules}/>
    );
});

export default TextEditor;