//@ts-nocheck
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import TextEditor from "ui/TextEditor/TextEditor";
import {getElementFromCursor} from "../../helpers/events";
import {useAddEvent} from "../../hooks/useAddEvent";

const InlineEditor = ({data, closeCallback}) => {
    const [value, setValue] = useState({text: data.value});
    const valRef = useRef();
    valRef.current = value;
    const ref = useRef();

    useAddEvent('mousedown', e => {
        if (!getElementFromCursor(e, 'ql-editor')) {
            close();
        }
    });

    function close() {
        let text = valRef.current.text;
        if (text === '<p><br></p>') text = '';
        setValue({text});
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
        ref.current.focus();
    }, []);
    useLayoutEffect(() => {
        if (!ref.current) return;
        let cont = ref.current.editor.container.closest(".transform-item");
        window.actions.elements.initContainer(cont);
    }, [value]);
    return (
        <TextEditor ref={ref}
                    config={data.config}
                    message={value}
                    callback={setValue}></TextEditor>
    );
};

export default InlineEditor;