import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {BaseMessagesContainer} from "../../Messenger/Message/MessagesContainer";
import {doc, updateDoc} from "firebase/firestore";
import InputContainer from "../../Messenger/Input/InputContainer";
import Comments from "./Comments";
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {AttachmentPreview, InputAttachment, InputEmoji, InputSend} from "../../Messenger/Input/MessengerInput";
import Container from "../../../ui/Container/Container";
import "./Comments.scss";
import {actions} from "../store/reducers";
import {CDB} from "../../Messenger/api/config";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import {MessageManager, updateUser} from "../../Messenger/api/firebase";
import store from "store";
import CommentsTools from "./CommentsTools";
import {useSelector} from "react-redux";
import {createCommentsTree, sortFunction} from "./helpers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";

export const CommentsInput = ({message, sendCallback, inputCallback}) => {
    console.log(message)
    return (
        <div className={"custom-input comments-input"}>
            <div className="input-wrapper">
                <div className={"input-field"}>
                    <div className="editor-wrapper">
                        <TextEditor config={'comments'}
                                    message={message}
                                    callback={inputCallback}></TextEditor>
                    </div>
                </div>
            </div>
            <AttachmentPreview message={message}></AttachmentPreview>
            <ActionButton onClick={sendCallback} key={'comments-send'}>Отправить</ActionButton>
        </div>
    );
};

export const CommentsContext = createContext(null);

const CommentsContainer = ({page}) => {
    const [comments, setComments] = useState({});
    const [commentsTree, setCommentsTree] = useState({});
    const [sorting, setSorting] = useState(() => () => {});

    const config = {
        onsuccess: (message) => {},
        getDocument: () => String(page),
        userNoTyping: () => {},
        userTyping: () => {},
        clearHTML: false,
        messageSubmit: () => [true, ''],
    }
    useEffect(() => {
        setCommentsTree(createCommentsTree(Object.values(comments), sorting));
    }, [sorting, comments]);

    const manager = new MessageManager('comments', actions, config);

    return (
        <CommentsContext.Provider value={manager}>
            <BaseMessagesContainer id={page} callback={setComments} document={doc(CDB, String(page))}>
            </BaseMessagesContainer>
            <div className={"comments-section"}>
                <div className="comments-section__header">
                    <InputContainer children={CommentsInput} manager={manager}></InputContainer>
                    <CommentsTools callback={(e) => setSorting(() => sortFunction(e.target.value))}></CommentsTools>
                </div>
                <div className={"comments"}>
                    <Comments comments={commentsTree}></Comments>
                </div>
            </div>
        </CommentsContext.Provider>
    );
};

export default CommentsContainer;