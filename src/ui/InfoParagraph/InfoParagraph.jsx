import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./InfoParagraph.scss";
import {triggerEvent} from "helpers/events";
import InlineEditor from "../../components/InlineEditor/InlineEditor";
import {clearTextFromHTML} from "../TextEditor/helpers";
import store from "../../store";


const InfoParagraph = ({type, children, id, ...props}) => {
    const ref = useRef();
    const [editor, setEditor] = useState({});
    useLayoutEffect(() => {
        setEditor({isOpened:false, value: children});
    }, [children]);
    function openEditor(event) {
        if (event.detail !== 2 || !window.editPage) return;
        triggerEvent("action:init", event);
        setEditor(e => ({...e, isOpened: true}));
    }
    function closeEditor(text) {
        if (text === null) {
            setEditor({isOpened: false, value: children});
            return;
        }
        let type = ref.current.classList[1].split('-')[1];
        let request = {method: "PATCH", data:{}};
        if (['textfield', 'comment', 'message'].includes(type)) {
            request.data = {type, text};
        } else {
            if (!clearTextFromHTML(text)) text = '';
            request.data[type] = text;
        }
        request.data.id = id;
        setEditor({isOpened: false, value: text});
        triggerEvent("action:callback", [request]);
    }

    useEffect(() => {
        if (type === 'textfield') {
            let cont = ref.current.closest(".transform-container");
            triggerEvent("container:init", {container: cont});
        }
    }, [editor.isOpened]);

    return (
        <span ref={ref} {...props} key={type}
              onClick={openEditor}
              className={`info__paragraph info__paragraph-${type}`}>
            {editor.isOpened ? <InlineEditor data={{
                    config: (type !== "price" ? 'editor' : 'simple'),
                    value: `<p>${editor.value}</p>`,
                    mount: ref,
                }} closeCallback={closeEditor}></InlineEditor> :
                editor.value && <div dangerouslySetInnerHTML={{__html: editor.value}}></div>}
        </span>
    );
};

export default InfoParagraph;