import React, {useCallback, useEffect, useRef, useState} from 'react';
import TextEditor from "ui/TextEditor/TextEditor";
import {triggerEvent} from "../../helpers/events";
// import "components/Messenger/Input/MessengerInput.scss";

const InlineEditor = ({data, closeCallback, mount}) => {
    const [value, setValue] = useState({text: data.value});
    const ref = useRef();
    useEffect(() => {
        ref.current.editor.container.addEventListener('keydown', event => {
            if (event.key === 'Escape' || (event.key === 'Enter' && event.ctrlKey)) {
                let text = ref.current.value;
                if (text === '<p><br></p>') text = '';
                closeCallback(text, mount);
            }
        });
        ref.current.focus();
        if (data.config === 'editor') {
            let block = ref.current.editor.container.closest('.quill');
            block.closest('.transform-item').style.width = Math.max(300, block.clientWidth + 50) + "px";
        }

        triggerEvent("container:init", {container:ref.current.editor.container.closest(".transform-container")});
    }, []);

    return (
        // <div className={"custom-input messenger-input"}>
        //     <div className={"input-field"}>
        //         <div className="editor-wrapper">
                    <TextEditor ref={ref}
                                config={data.config}
                                message={value}
                                callback={setValue}></TextEditor>
                // </div>
            // </div>
        // </div>
    );
};

export default InlineEditor;