import React from 'react';
import "./Message.scss";
import dayjs from "dayjs";
import TextLoader from "ui/TextLoader/TextLoader";
import ItemData, {Components} from "components/Item/components/ItemData";
import {matchURL} from "../../../../helpers/events";

const Message = ({data}) => {
    const formattedDate = (data.timeSent ? dayjs(data.timeSent).format("HH:mm DD.MM") : "");
    let upload = data.value.upload;
    let text = matchURL(data.value.text);
    const style = upload.height ? {aspectRatio: +(upload.container_width.slice(0, -2)) / +(upload.height.slice(0, -2))} : {}
    return (
        <div className={"message-inner"} style={(!!upload.url && ['image', 'video'].includes(upload.type)) ? {width:'100%'} : {}}>
            <div className={"message"}>
                <div className={'message-upload__wrapper'} style={style}>
                    {!!upload && !!upload.url && !!upload.type && <ItemData data={upload}></ItemData>}
                </div>
                <p className={"message-text"} dangerouslySetInnerHTML={{__html: text}}></p>
                {upload.uploading && <p className={"message-text"}>{upload.filename}</p>}
                <TextLoader className={'attachment-loading'} isLoading={upload.uploading}>Загрузка</TextLoader>
                {!!formattedDate && <p className={"message-date"}>{formattedDate}</p>}
            </div>
        </div>
    );
};

export default Message;