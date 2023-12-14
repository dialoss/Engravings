//@ts-nocheck
import {useEffect, useLayoutEffect, useState} from 'react'
import {codegen, Editor, Inputs} from "@compai/css-gui";


export function format(style): string {
    if (!style) return "{}";
    let strings = style.split('\n').slice(1, -1);
    let s = '{ ' + strings.map((t, i) => {
        let [key, ...val] = t.trim().slice(0, -1).split(":");
        val = val.join(':');
        let n = "";
        for (let i = 0; i < key.length; i++) {
            if (key[i] === '-') {
                n += key[i + 1].toUpperCase();
                ++i;
            } else {
                n += key[i];
            }
        }
        val = val.replaceAll(`"`, ``);
        let serialized = `"${n.trim()}":"${val.trim()}"`;
        if (i !== strings.length - 1) serialized += ',';
        return serialized;
    }).join(' ') + ' }';
    return s;
}

export const CSSEditor = ({style, setStyle}) => {
    const [styles, setStyles] = useState(style);
    useLayoutEffect(() => {
        setStyles(style);
    }, [style]);
    useEffect(() => {
        if (!Object.keys(styles).length) return;
        setStyle(JSON.stringify({
            editor: styles,
            css: format(codegen.css(styles)),
        }));
    }, [styles]);
    // console.log(styles)
    return (
        <div className="editor">
            <div className="editor__inner">
                <Editor styles={styles}
                        onChange={setStyles}
                        showRegenerate={false}
                        showAddProperties={false}
                        hideResponsiveControls={true}>
                    <div>
                        <Inputs.FontSize key={"FONT_SIZE"}></Inputs.FontSize>
                        <Inputs.BackgroundColor key={"BG_COLOR"}></Inputs.BackgroundColor>
                        <Inputs.Background key={"BG_IMAGE"}></Inputs.Background>
                        <Inputs.BoxShadow  key={"SHADOW"}></Inputs.BoxShadow>
                        <Inputs.Border key={"BORDER"}></Inputs.Border>
                        <Inputs.AspectRatio key={"ASPECT"}></Inputs.AspectRatio>
                    </div>
                </Editor>
            </div>
            <div className="preview">
                <pre>{codegen.css(styles)}</pre>
            </div>
        </div>
    )
}