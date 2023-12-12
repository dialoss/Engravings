//@ts-nocheck
import {useEffect, useState} from 'react'
import {codegen, Editor, Inputs, ResponsiveInput, styled, Styles} from '@compai/css-gui'

export function format(style): string {
    if (!style) return "{}";
    let strings = style.split('\n').slice(1, -1);
    let s = '{ ' + strings.map((t, i) => {
        t = t.trim().slice(0, -1);
        let n = '';
        for (let i = 0; i < t.length; i++) {
            if (t[i] === '-') {
                n += t[i + 1].toUpperCase();
                ++i;
            } else {
                n += t[i];
            }
        }
        let [key, val] = n.split(":");
        let serialized = `"${key.trim()}": "${val.trim()}"`;
        if (i !== strings.length - 1) serialized += ',';
        return serialized;
    }).join(' ') + ' }';
    return s;
}

export const CSSEditor = ({style, setStyle}) => {
    const [styles, setStyles] = useState(style);
    useEffect(() => {
        setStyle(format(codegen.css(styles)));
    }, [styles]);
    return (
        <>
            <Editor styles={styles}
                    onChange={setStyles}
                    showRegenerate={false}
                    showAddProperties={false}
                    hideResponsiveControls={true}>
            </Editor>
            <pre>{codegen.css(styles)}</pre>
        </>
    )
}