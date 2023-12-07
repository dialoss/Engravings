import React from 'react';
import CarouselNavArrow from "../NavArrow/NavArrow";

const CarouselNavbar = ({side}) => {
    return (
        <div className={"carousel__nav-bar modal__toggle-button navigation " +  "carousel__nav-bar--" + side}>
            <CarouselNavArrow side={side}></CarouselNavArrow>
        </div>
    );
};

export default CarouselNavbar;