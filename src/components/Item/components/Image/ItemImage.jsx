import React, {useCallback, useEffect, useRef} from 'react';
import './ItemImage.scss';
import {triggerEvent} from "helpers/events";
import {preventOnTransformClick} from "ui/ObjectTransform/helpers";
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";

const ItemImage = ({data, ...props}) => {
    const ref = useRef();
    const carouselCallback = useCallback((event) => {
        if (preventOnTransformClick(ref) || event.ctrlKey || window.editPage) return;
        triggerEvent('carousel:open', data);
    }, []);

    return (
        <div className="item__image" ref={ref} {...props}>
            <img src={data.url} alt=""
                 onClick={carouselCallback}
                 onDragStart={e => e.preventDefault()}/>
            <InfoBlock data={data}></InfoBlock>
        </div>
    );
};

export default ItemImage;