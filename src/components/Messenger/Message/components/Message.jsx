import React from 'react';
import "./Message.scss";
import dayjs from "dayjs";
import TextLoader from "ui/TextLoader/TextLoader";
import {Components} from "components/Item/components/ItemData";

const Message = ({data}) => {
    const formattedDate = (data.timeSent ? dayjs(data.timeSent).format("HH:mm DD.MM") : "");
    let upload = data.value.upload;
    let text = data.value.text;
    return (
        <div className={"message"}>
            {!!upload && !!upload.url && !!upload.type && React.createElement(Components[upload.type], {data:upload})}
            <p className={"message-text"}>{text}</p>
            {upload.uploading && <p className={"message-text"}>{upload.filename}</p>}
            <TextLoader className={'attachment-loading'} isLoading={upload.uploading}>Загрузка</TextLoader>
            {/*{data.isRead ? 'прочитано' : 'не прочитано'}*/}
            {!!formattedDate && <p className={"message-date"}>{formattedDate}</p>}
        </div>
    );
};

export default Message;