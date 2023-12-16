//@ts-nocheck
import React, {useCallback, useLayoutEffect, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import {parse} from "../../Item/Item";
import {format} from "../CSSEditor/CSSEditor";

function init(s) {
    let editor = "{\n";
    for (const l in s) {
        let n = "";
        for (let i = 0; i < l.length; i++) {
            if (l[i] === l[i].toUpperCase()) {
                n += "-" + l[i].toLowerCase();
            } else {
                n += l[i];
            }
        }
        editor += `  ${n}: ${s[l]};\n`;
    }
    editor += '}';
    return editor;
}

const CodeEditor = ({id, style, setStyle}) => {
    const [value, setValue] = useState();
    const onChange = useCallback((val, viewUpdate) => {
        console.log(val)
        setStyle(format(val))
    }, []);
    useLayoutEffect(() => {
        setValue(init(parse(style)) || '');
    }, [id]);
    return (
        <div className={'code-editor'}>
            <CodeMirror value={value} height={"100%"} extensions={[css()]} onChange={onChange}/>
        </div>
    );
}

export default CodeEditor;