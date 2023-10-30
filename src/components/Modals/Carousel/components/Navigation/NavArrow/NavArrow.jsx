import React, {useCallback} from 'react';
import rightArrow from './right.svg';
import {triggerEvent} from "helpers/events";

const CarouselNavArrow = ({side}) => {
    return (
        <button className={"carousel__nav-btn"} onClick={() => triggerEvent('carousel:' + side)}>
            <img src={rightArrow} alt=""/>
        </button>
    );
};

export default CarouselNavArrow;