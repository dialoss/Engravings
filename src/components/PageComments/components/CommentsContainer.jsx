import React, {createContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {BaseMessagesContainer} from "../../Messenger/Message/MessagesContainer";
import {arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import InputContainer from "../../Messenger/Input/InputContainer";
import Comments from "./Comments";
import TextEditor from "../../../ui/TextEditor/TextEditor";
import {AttachmentPreview, CustomUpload} from "../../Messenger/Input/MessengerInput";
import "./Comments.scss";
import {actions} from "../store/reducers";
import {CDB, firestore} from "../../Messenger/api/config";
import {MessageManager} from "../../Messenger/api/firebase";
import store from "store";
import CommentsTools from "./CommentsTools";
import {createCommentsTree, sortFunction} from "./helpers";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {sendEmail} from "../../../api/requests";
import {getLocation} from "../../../hooks/getLocation";
import {useSelector} from "react-redux";
import {SearchContainer} from "../../../ui/Tools/Tools";
import {sendCloudMessage} from "../../Messenger/api/notifications";
import NavButton from "../../../ui/Navbar/Button/NavButton";
import DelayedVisibility from "../../../ui/DelayedVisibility/DelayedVisibility";

export const CommentsInput = ({message, sendCallback, inputCallback}) => {
    return (
        <CustomUpload name={'comments-input'} inputCallback={inputCallback}>
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
                          modalToggle={false}
                          focus={true}
                          authorizeAction={true}
                          key={'comments-send'}>Отправить</ActionButton>
        </CustomUpload>
    );
};

export const CommentsContext = createContext(null);

const CommentsContainer = ({page, document, setDocument}) => {
    const [search, setSearch] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentsTree, setCommentsTree] = useState({});
    const [sorting, setSorting] = useState(() => sortFunction('default'));
    const user = useSelector(state => state.users.current);
    useLayoutEffect(() => {
        if (!page) return;

        function fetchDocument(created) {
            if (created) {
                if (user.isAdmin) updateDoc(doc(firestore, 'apps', 'comments'), {newComments: arrayRemove(page)});
                setDocument(doc(CDB, String(page)));
                return;
            }
            const it = setInterval(() => {
                fetch();
            }, 1000);
            function fetch() {
                try {
                getDoc(doc(CDB, String(page))).then(d => {
                    clearInterval(it);
                    if (!d.data()) {
                        setDoc(doc(CDB, String(page)), {messages: []}).then(d => fetchDocument(true));
                    } else {
                        fetchDocument(true);
                    }
                });
                } catch (e) {console.log(e)}
            }
            fetch();
        }
        fetchDocument(false);

    }, [page]);

    const config = {
        onsuccess: (message) => {
            const location = getLocation();
            const users = store.getState().users.users;
            const thread = message.parent;
            if (thread) {
                const parentUser = users[comments.find(comm => comm.id === thread).user];
                parentUser && sendCloudMessage({
                    title: 'MyMount | Новый комментарий',
                    body: user.name + ': ' + (message.value.text || message.value.upload.filename),
                    data: {url: getLocation().fullURL + '?action=comments&id=' + message.id},
                    companion: parentUser.email,
                });
            }

            sendEmail({
                recipient: 'matthewwimsten@gmail.com',
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
    const limitStep = 40;
    const [limit, setLimit] = useState(limitStep);
    useEffect(() => {
        setCommentsTree(createCommentsTree(comments, sorting, search, limit));
    }, [sorting, search, limit]);

    const manager = new MessageManager('comments', actions, config);
    return (
        <CommentsContext.Provider value={manager}>
            <BaseMessagesContainer id={page} callback={setComments} document={document}>
            </BaseMessagesContainer>
            <DelayedVisibility timeout={1000} trigger={page}>
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
                        {limit < comments.length &&
                            <NavButton className={"load-more"}
                                       data={{text: 'Показать больше', callback:()=>setLimit(l => l + limitStep)}}></NavButton>}
                    </div>
                </div>
            </DelayedVisibility>

        </CommentsContext.Provider>
    );
};

export default CommentsContainer;