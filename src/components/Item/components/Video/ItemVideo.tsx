import React, {useEffect, useRef} from 'react';
import "./ItemVideo.scss";
import InfoBlock from "ui/InfoBlock/InfoBlock";

const ItemVideo = ({data, ...props}) => {
    if (!data.url.match(/youtube|drive/)) data.url = "https://drive.google.com/file/d/"+data.url+'/preview'

    return (
        <div className="item__video" {...props} id={data.url}
               style={{aspectRatio: data.media_width / data.media_height}}>
            <iframe src={data.url} allowFullScreen={true}></iframe>
            <InfoBlock data={data}></InfoBlock>
        </div>
    );
};

export default ItemVideo;