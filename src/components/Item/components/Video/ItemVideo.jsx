import React, {useEffect, useRef} from 'react';
import "./ItemVideo.scss";
import 'vlitejs/vlite.css';
import Vlitejs from 'vlitejs';
import VlitejsYoutube from 'vlitejs/providers/youtube.js';
Vlitejs.registerProvider('youtube', VlitejsYoutube);

const ItemVideo = ({data, ...props}) => {
    const ref = useRef();
    const yt = data.style === 'youtube';
    useEffect(() => {
        new Vlitejs(ref.current, {
            // options: {autohide: true, autoHideDelay: 1000},
            // provider: yt ? 'youtube' : 'html5',
            provider: 'youtube'
        });
    }, []);
    let id = data.url.match(/(?<=\?v=)\w*/);
    if (id) id = id[0];
    return (
        <>
            {!yt ? <video className="item__video" ref={ref}
                                               preload="metadata"
                                               src={data.url}
                                               {...props}
                                               style={{aspectRatio: data.media_width / data.media_height}}>
                </video> :
                <div ref={ref} data-youtube-id={id} id={'player'}></div>
            }
        </>
    );
};

export default ItemVideo;