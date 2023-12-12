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

const sides = ['top', 'right', 'bottom', 'left'];

function format4String(s, name) {
    let val = s[name];
    console.log(s, name)
    if (!val) return {}
    let map = {};
    val.split(' ').forEach((v, i) => {
        let unit = v.match(/\D+/);
        if (unit) unit = unit[0];
        else unit = "px";
        map[sides[i]] = {
            value: +v.match(/\d+/)[0],
            unit,
        }
    });
    return {[name]: map};
}

function format1String(s) {

}

function ratio(s) {
    if (!s || !s.match(/\d/)) return "auto";
    return {
        width: +(s.split('/')[0]),
        height: +(s.split('/')[1])
    }
}

const defaultStyle = {
    backgroundColor: "#fff",
    aspectRatio: "auto",
    // boxShadow: "0 0 5px grey",
    // zIndex: 1,
    ...format4String({padding:"8px 8px 8px 8px"}, "borderRadius"),
    ...format4String({padding:"4px 4px 4px 4px"}, "padding"),
};

function init(style) {
    let s = JSON.parse(style);
    return {
        ...defaultStyle,
        ...s,
        aspectRatio: ratio(s.aspectRatio),
        ...format4String(s, "padding"),
        ...format4String(s, "margin"),
    };
}

export const CSSEditor = ({style, setStyle}) => {
    const [styles, setStyles] = useState(init(style));
    useEffect(() => {
        setStyle(format(codegen.css(styles)));
    }, [styles]);
    console.log(styles)
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