import React from 'react';
import CarouselNavbar from "./Navbar/Navbar";

const CarouselNav = () => {
    return (
        <div className="carousel__nav">
            <CarouselNavbar side={"left"}></CarouselNavbar>
            <CarouselNavbar side={"right"}></CarouselNavbar>
        </div>
    );
};

export default CarouselNav;