import React, {useCallback, useEffect, useRef} from 'react';
import './ItemImage.scss';
import {triggerEvent} from "helpers/events";
import {preventOnTransformClick} from "ui/ObjectTransform/helpers";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";
import {getCompressedImage} from "./helpers";

const ItemImage = ({data, ...props}) => {
    const ref = useRef();
    const carouselCallback = useCallback((event) => {
        if (preventOnTransformClick(ref) || event.ctrlKey || window.editPage) return;
        triggerEvent('carousel:open', data);
    }, []);

    return (
        <>
            <div className="item__image" ref={ref} {...props} style={{aspectRatio: data.media_width / data.media_height}}>
                <img src={getCompressedImage(data, data.quality || 700)} alt=""
                    onClick={carouselCallback}
                     referrerPolicy="no-referrer"
                     onDragStart={e => e.preventDefault()}/>
            </div>
            {!data.empty_info && <InfoBlock data={data}></InfoBlock>}
        </>
);
};

export default ItemImage;