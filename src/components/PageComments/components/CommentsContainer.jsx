import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {BaseMessagesContainer} from "../../Messenger/Message/MessagesContainer";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import InputContainer from "../../Messenger/Input/InputContainer";
import Comments from "./Comments";
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {AttachmentPreview, InputAttachment, InputEmoji, InputSend} from "../../Messenger/Input/MessengerInput";
import Container from "../../../ui/Container/Container";
import "./Comments.scss";
import {actions} from "../store/reducers";
import {CDB} from "../../Messenger/api/config";
import {FirebaseContainer} from "../../../api/FirebaseContainer";
import {MessageManager, updateRoom, updateUser} from "../../Messenger/api/firebase";
import store from "store";
import CommentsTools from "./CommentsTools";
import {useSelector} from "react-redux";
import {createCommentsTree, sortFunction} from "./helpers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {sendLocalRequest} from "../../../api/requests";
import {SearchContainer} from "../../../modules/FileExplorer/FileExplorer";

export const CommentsInput = ({message, sendCallback, inputCallback}) => {
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
            <ActionButton onClick={sendCallback}
                          authorizeAction={true}
                          key={'comments-send'}>Отправить</ActionButton>
        </div>
    );
};

export const CommentsContext = createContext(null);

const CommentsContainer = ({page}) => {
    const [search, setSearch] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentsTree, setCommentsTree] = useState({});
    const [sorting, setSorting] = useState(() => sortFunction('newest'));
    const [document, setDocument] = useState(null);

    useLayoutEffect(() => {
        getDoc(doc(CDB, String(page))).then(d => {
            if (!d.data()) {
                setDoc(doc(CDB, String(page)), {messages:[]});
            } else {
                updateDoc(doc(CDB, String(page)), {newMessage: false});
                setDocument(doc(CDB, String(page)));
            }
        });
    }, [page]);

    const config = {
        onsuccess: (message) => {
            sendLocalRequest('/api/notification/email/', {
                recipient: 'matthewwimsten@gmail.com',
                // recipient: 'fomenko75@mail.ru',
                subject: 'Новый комментарий',
                data: {
                    page,
                    message: message.value.text,
                }
            }, 'POST');
            // updateDoc(doc(CDB, ''), {newMessage: true});
        },
        getDocument: () => String(page),
        userNoTyping: () => {},
        userTyping: () => {},
        clearHTML: false,
        messageSubmit: () => [true, ''],
    }
    useEffect(() => {
        setSearch(comments);
    }, [comments]);
    useEffect(() => {
        setCommentsTree(createCommentsTree(Object.values(search), sorting));
    }, [sorting, search]);

    const manager = new MessageManager('comments', actions, config);
    console.log(comments)
    return (
        <CommentsContext.Provider value={manager}>
            {document && <BaseMessagesContainer id={page} callback={setComments} document={document}>
            </BaseMessagesContainer>}
            <div className={"comments-section"}>
                <div className="comments-section__header">
                    <InputContainer children={CommentsInput} manager={manager}></InputContainer>
                    <div className={"comments-tools__wrapper"}>
                        <CommentsTools callback={(e) => setSorting(() => sortFunction(e.target.value))}></CommentsTools>
                        <SearchContainer placeholder={'Поиск по комментариям'}
                                         data={search}
                                         inputCallback={v => (!v && setSearch(comments))}
                                         searchBy={'value.text'}
                                         setData={setSearch}></SearchContainer>
                    </div>
                </div>
                <div className={"comments"}>
                    <Comments comments={commentsTree}></Comments>
                </div>
            </div>
        </CommentsContext.Provider>
    );
};

export default CommentsContainer;