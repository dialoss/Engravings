import React, {useEffect, useRef} from 'react';
import "./ItemVideo.scss";

import Plyr from 'plyr';
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";

const ItemVideo = ({data, ...props}) => {
    const ref = useRef();
    const yt = data.style === 'youtube';
    useEffect(() => {
        const player = new Plyr(ref.current, {
            settings: ['quality', 'speed'],
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'settings', 'pip', 'fullscreen'],
            clickToPlay: true,
        });

    }, []);
    let id = data.url.match(/(?<=\?v=)\w*/);
    if (id) id = id[0];
    return (
        // <>
           <div className="item__video" {...props}
                                               style={{aspectRatio: data.media_width / data.media_height}}>
                    <video preload="metadata" ref={ref}
                            src={data.url}></video>
               <InfoBlock data={data}></InfoBlock>
        {/*        </div> :*/}
        {/*        <div className="plyr__video-embed">*/}
        {/*            <iframe*/}
        {/*                src={`https://www.youtube.com/embed/${id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}*/}
        {/*                allowFullScreen*/}
        {/*                allowTransparency*/}
        {/*                allow="autoplay"*/}
        {/*            ></iframe>*/}
        {/*        </div>*/}
        {/*    }*/}
        {/*</>*/}
           </div>
    );
};

export default ItemVideo;