//@ts-nocheck
import React, {useContext} from 'react';
import rightArrow from './right.svg';
import {CarouselContext} from "../../../CarouselContainer";

const CarouselNavArrow = ({side}) => {
    const nav = useContext(CarouselContext);
    return (
        <button className={"carousel__nav-btn"} onClick={nav[side]}>
            <img src={rightArrow} alt=""/>
        </button>
    );
};

export default CarouselNavArrow;