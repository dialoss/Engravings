//@ts-nocheck
import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as RCarousel } from 'react-responsive-carousel';

const config = {
    showThumbs: false,
    emulateTouch: true,
    infiniteLoop:true,
    autoPlay:true,
    swipeable:true,
}

const Carousel = ({items}) => {
    return (
        <RCarousel {...config}>
            {items}
        </RCarousel>
    );
};

export default Carousel;