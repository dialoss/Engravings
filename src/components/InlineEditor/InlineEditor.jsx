import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import TextEditor from "ui/TextEditor/TextEditor";
import {getElementFromCursor, triggerEvent} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";

const InlineEditor = ({data, closeCallback}) => {
    const [value, setValue] = useState({text: data.value});
    const valRef = useRef();
    valRef.current = value;
    const ref = useRef();
    const clickEvent = useRef();

    useAddEvent("mousedown", (e) => {
        clickEvent.current = e;
    })
    function close() {
        let text = valRef.current.text;
        if (text === '<p><br></p>') text = '';
        closeCallback(text);
    }
    useEffect(() => {
        ref.current.editor.container.addEventListener('keydown', event => {
            event.stopPropagation();
            if (event.key === 'Enter' && event.ctrlKey) {
                close();
            }
            if (event.key === 'Escape') {
                closeCallback(null);
            }
        });
        ref.current.editor.root.addEventListener('blur', e => {
            console.log(e)
            if (!getElementFromCursor(clickEvent.current, 'ql-editor')) {
                close();
            }
        })
        ref.current.focus();
        if (data.config === 'editor') {
            let block = ref.current.editor.container.closest('.quill');
            let item = block.closest('.transform-item');
            item.style.width = Math.max(300, item.clientWidth) + "px";
        }
    }, []);
    useLayoutEffect(() => {
        if (!ref.current) return;
        let cont = ref.current.editor.container.closest(".transform-container");
        triggerEvent("container:init", {container: cont});
    }, [value]);

    return (
        <TextEditor ref={ref}
                    config={data.config}
                    message={value}
                    callback={setValue}></TextEditor>
    );
};

export default InlineEditor;