import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {BaseMessagesContainer} from "../../Messenger/Message/MessagesContainer";
import {arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import InputContainer from "../../Messenger/Input/InputContainer";
import Comments from "./Comments";
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {AttachmentPreview} from "../../Messenger/Input/MessengerInput";
import "./Comments.scss";
import {actions} from "../store/reducers";
import {CDB, firestore} from "../../Messenger/api/config";
import {MessageManager} from "../../Messenger/api/firebase";
import store from "store";
import CommentsTools from "./CommentsTools";
import {createCommentsTree, sortFunction} from "./helpers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {sendEmail} from "../../../api/requests";
import {SearchContainer} from "../../../modules/FileExplorer/FileExplorer";
import {getLocation} from "../../../hooks/getLocation";
import {useSelector} from "react-redux";

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
    const [sorting, setSorting] = useState(() => sortFunction('default'));
    const [document, setDocument] = useState(null);
    const user = useSelector(state => state.users.current);

    useLayoutEffect(() => {
        function fetchDocument(created) {
            if (created) {
                if (user.isAdmin) updateDoc(doc(firestore, 'apps', 'comments'), {newComments: arrayRemove(page)});
                setDocument(doc(CDB, String(page)));
                return;
            }
            const it = setInterval(() => {
                getDoc(doc(CDB, String(page))).then(d => {
                    clearInterval(it);
                    if (!d.data()) {
                        setDoc(doc(CDB, String(page)), {messages:[]}).then(d => fetchDocument(true));
                    } else {
                        fetchDocument(true);
                    }
                });
            }, 1000);
        }
        fetchDocument(false);
    }, [page]);

    const config = {
        onsuccess: (message) => {
            const location = getLocation();
            sendEmail({
                type: 'comment',
                subject: 'MyMount | Новый комментарий',
                data: {
                    page: location.relativeURL,
                    message: message.value.text,
                    reply: location.fullURL,
                    user,
                }
            });
            updateDoc(doc(firestore, 'apps', 'comments'), {newComments: arrayUnion(page)});
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
        setCommentsTree(createCommentsTree(comments, sorting, search));
    }, [sorting, search]);
    // console.log(commentsTree)
    const manager = new MessageManager('comments', actions, config);
    return (
        <CommentsContext.Provider value={manager}>
            {document && <BaseMessagesContainer id={page} callback={setComments} document={document}>
            </BaseMessagesContainer>}
            <div className={"comments-section"}>
                <div className="comments-section__header">
                    <InputContainer extraFields={{parent: ''}} children={CommentsInput} manager={manager}></InputContainer>
                    <div className={"comments-tools__wrapper"}>
                        <CommentsTools callback={(e) => setSorting(() => sortFunction(e.target.value))}></CommentsTools>
                        <SearchContainer placeholder={'Поиск по комментариям'}
                                         data={comments}
                                         inputCallback={v => !v && setSearch(comments)}
                                         searchBy={'value.text'}
                                         setData={setSearch}></SearchContainer>
                    </div>
                </div>
                <div className={"comments"}>
                    <p id={'counter'}>Всего комментариев: {search.length}</p>
                    <Comments comments={commentsTree}></Comments>
                </div>
            </div>
        </CommentsContext.Provider>
    );
};

export default CommentsContainer;