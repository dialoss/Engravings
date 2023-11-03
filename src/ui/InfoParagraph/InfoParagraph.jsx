import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./InfoParagraph.scss";
import {triggerEvent} from "helpers/events";
import InlineEditor from "../../components/InlineEditor/InlineEditor";
import {clearTextFromHTML} from "../TextEditor/helpers";

const InfoParagraph = ({type, children, ...props}) => {
    const ref = useRef();
    const [editor, setEditor] = useState({isOpened:false, value: children});
    function openEditor(event) {
        if (event.detail !== 2) return;
        triggerEvent("action:init", event);
        setEditor(e => ({...e, isOpened: true}));
    }
    function closeEditor(text) {
        let type = ref.current.classList[1].split('-')[1];
        let request = {method: "PATCH", specifyElement: true, data:{}};
        let value = text;
        if (type === 'textfield') {
            request.data = {type, text};
        } else {
            value = clearTextFromHTML(text);
            request.data[type] = value;
        }
        setEditor({isOpened: false, value});
        triggerEvent("action:callback", [request]);
    }

    useEffect(() => {
        let cont = ref.current.closest(".transform-container");
        // console.log(cont)
        triggerEvent("container:init", {container: cont});
    }, [editor.isOpened]);

    // const callback = isTouchDevice() ? {onTouchEnd: editorCallback} : {onMouseDown: editorCallback};
    return (
        <span ref={ref} {...props} key={type}
            onClick={openEditor}
            className={`info__paragraph info__paragraph-${type}`}>
            {editor.isOpened ? <InlineEditor data={{
                config: (type === "textfield" ? 'editor' : 'simple'),
                value: editor.value,
            }} closeCallback={closeEditor}></InlineEditor> :
                <div dangerouslySetInnerHTML={{__html: editor.value}}></div>}
        </span>
    );
};

export default InfoParagraph;