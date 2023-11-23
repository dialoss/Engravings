import React, {useContext, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import dayjs from "dayjs";
import InfoParagraph from "../../../ui/InfoParagraph/InfoParagraph";
import Avatar from "../../../ui/Avatar/Avatar";
import ItemData, {Components} from "../../Item/components/ItemData";
import InputContainer from "../../Messenger/Input/InputContainer";
import {CommentsContext, CommentsInput} from "./CommentsContainer";
import "./Comment.scss";
import TextLoader from "../../../ui/TextLoader/TextLoader";
import {matchURL} from "../../../helpers/events";
import {clearTextFromHTML} from "../../../ui/TextEditor/helpers";

const Comment = ({data}) => {
    const users = useSelector(state => state.users.users);
    const [reply, setReply] = useState(false);
    let upload = data.value.upload;
    const user = users[data.user] || data.user;
    const manager = useContext(CommentsContext);
    const ref = useRef();
    useEffect(() => {
        if (reply) ref.current.classList.add('visible');
    }, [reply]);
    function closeInput() {
        ref.current.classList.remove('visible');
        setTimeout(() => setReply(r => !r), 180)
    }
    if (data.value.text.match(/youtube/)) {
        upload = {
            type: 'video',
            style: 'youtube',
            url: clearTextFromHTML(data.value.text),
        }
    }
    return (
        <div className={"comment"} id={"comment " + data.id}>
            <div className="comment-block">
                <Avatar user={user} src={user.picture}></Avatar>
                <div className="comment-block__text">
                    <p className={"comment-username"}>{user.name || 'Гость'}</p>
                    <p className={"comment-date"}>{dayjs(data.timeSent).format("HH:mm DD.MM.YYYY")}</p>
                </div>
            </div>
            <InfoParagraph type={'comment'}>{matchURL(data.value.text)}</InfoParagraph>
            {upload.uploading && <p>{upload.filename}</p>}
            <TextLoader className={'attachment-loading'} isLoading={upload.uploading}>Загрузка</TextLoader>
            {!!upload && !!upload.url && !!upload.type && <ItemData data={{...upload, navigation: false}}/>}
            <div className={"comment-reply__button"} onClick={() => {
                if (ref.current) closeInput();
                else setReply(r => !r)
           }}>Ответить</div>
            {reply &&
                <div className={"comment-reply"} ref={ref}>
                    <InputContainer extraFields={{parent: data.id}}
                                children={CommentsInput}
                                manager={manager}></InputContainer>
            </div>}
        </div>
    );
};

export default Comment;