import React from 'react';
import CarouselNav from "../Navigation/Navigation";

import InfoBlock from "ui/InfoBlock/InfoBlock";
import "./Carousel.scss";
import styles from "./Carousel.module.scss";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";

const Carousel = ({item, contentOuter}) => {
    return (
        <div className={"carousel"}>
            <div className="carousel__content content-inner">
                <img className="carousel__image" src={item.url} alt=""/>
            </div>
        </div>
    );
};

export default Carousel;