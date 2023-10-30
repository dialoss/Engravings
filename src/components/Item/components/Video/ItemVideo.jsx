import React from 'react';
import "./ItemVideo.scss";

const ItemVideo = ({data, ...props}) => {
    return (
        <video className="item__video" preload="metadata" id="player"
               playsInline controls {...props}>
            <source src={data.url} type="video/mp4"/>
        </video>
    );
};

export default ItemVideo;