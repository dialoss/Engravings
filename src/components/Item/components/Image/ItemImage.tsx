//@ts-nocheck
import React, {useCallback, useRef} from 'react';
import './ItemImage.scss';
import {preventOnTransformClick} from "ui/ObjectTransform/helpers";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";
import {getCompressedImage} from "./helpers";
import {pageEditable} from "../../../../modules/ItemList/store/reducers";

const ItemImage = ({data, ...props}) => {
    const ref = useRef();
    const carouselCallback = useCallback((event) => {
        if (preventOnTransformClick(ref) || event.ctrlKey || pageEditable() || data.carousel === false) return;
        window.callbacks.call("carousel", data);
    }, []);

    return (
        <div className={'item__image-wrapper'}>
            <div className="item__image" ref={ref} {...props} style={{aspectRatio: data.media_width / data.media_height}}>
                <img src={getCompressedImage(data, data.quality || 700)} alt=""
                    onClick={carouselCallback}
                     referrerPolicy="no-referrer"
                     onDragStart={e => e.preventDefault()}/>
            </div>
            <InfoBlock data={data}></InfoBlock>
        </div>
);
};

export default ItemImage;