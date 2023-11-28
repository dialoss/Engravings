import React, {useCallback} from 'react';
import "./Message.scss";
import dayjs from "dayjs";
import TextLoader from "ui/TextLoader/TextLoader";
import ItemData, {Components} from "components/Item/components/ItemData";
import {matchURL, triggerEvent} from "../../../../helpers/events";
import {clearTextFromHTML} from "../../../../ui/TextEditor/helpers";
import {preventOnTransformClick} from "../../../../ui/ObjectTransform/helpers";
import {pageEditable} from "../../../ItemList/ThemeManager/ThemeManager";


export const UploadPreview = ({message}) => {
    let upload = message.value.upload;
    for (let u of upload) {
        if (u.type === 'video') u.url = "https://drive.google.com/file/d/"+u.url+'/preview'
    }
    if (message.value.text.match(/youtube/)) {
        let id = clearTextFromHTML(message.value.text);
        id = id.match(/(?<=\?v=)\w*/) || id.match(/(?<=\/)\w*(\?si)/);
        upload = [{
            type:'video',
            url: 'https://www.youtube.com/embed/' + id,
            media_width: 1600,
            media_height: 900,
        }]
    }
    const carouselCallback = (index) => {
        triggerEvent('carousel:open', {item: index, items: upload.filter(u => u.type === 'image')});
    }
    const mediaItems = Math.min(3, upload.filter(u => ['image', 'video'].includes(u.type)).length);
    return (
        <div className={'upload-preview media-' + mediaItems}>
        {
            upload.map((u, i) => <div className={'upload'} key={i + u.filename} onClick={() => carouselCallback(i)}>
                    {!u.uploading ? <ItemData data={{...u, carousel: false}}></ItemData> :
                        <div key={i}>
                            <p className={"message-text"}>{u.filename}</p>
                            <TextLoader className={'attachment-loading'} isLoading={u.uploading}>Загрузка</TextLoader>
                        </div>}
                </div>
            )
        }
        </div>
    );
}

const Message = ({data}) => {
    const formattedDate = (data.timeSent ? dayjs(data.timeSent).format("HH:mm DD.MM") : "");
    let text = matchURL(data.value.text);
    return (
        <div className={"message-inner"}>
            <div className={"message"} data-id={data.id}>
                <UploadPreview message={data}></UploadPreview>
                <div className="message__text-wrapper">
                    <p className={"message-text"} dangerouslySetInnerHTML={{__html: text}}></p>
                    {!!formattedDate && <p className={"message-date"}>{formattedDate}</p>}
                </div>
            </div>
        </div>
    );
};

export default Message;