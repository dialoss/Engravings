//@ts-nocheck
import React, {useEffect, useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {configQuill, QuillModules} from "./config";
import "./TextEditor.scss";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";
import {createRoot} from "react-dom/client";

configQuill();

const TextEditor = React.forwardRef(function TextEditor({config, message, callback}, ref) {
    const clickEvent = useRef();

    useAddEvent("mousedown", (e) => {
        clickEvent.current = e;
    })
    const simple = config === 'simple';

    useEffect(() => {
        let root = ref.current.getEditor();
        let field = root.root;
        field.addEventListener('mousedown', e => {
            e.stopPropagation()
        });
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
    }

    const modules = QuillModules[config];

    return (
            <ReactQuill className={"ql-" + config}
                        ref={ref}
                        theme="snow"
                        value={message.text}
                        onChange={inputCallback}
                        modules={modules}/>
    );
});

export default TextEditor;