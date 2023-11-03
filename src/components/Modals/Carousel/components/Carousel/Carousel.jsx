import React from 'react';
import CarouselNav from "../Navigation/Navigation";

import InfoBlock from "ui/InfoBlock/InfoBlock";
import "./Carousel.scss";
import styles from "./Carousel.module.scss";
import WindowButton from "ui/Buttons/WindowButton/WindowButton";

const Carousel = ({item}) => {
    return (
        <div className={"carousel"}>
            <div className="carousel__content content-inner">
                <img className="carousel__image" src={item.url} alt=""/>
            </div>
            <div className="content-outer" style={{display: 'none'}}>
                {item.info && <InfoBlock data={item.info} className={styles['info__block']}></InfoBlock>}
                {item.navigation && <CarouselNav></CarouselNav>}
                <WindowButton type={'close'} className={styles['window-close']}/>
            </div>
        </div>
    );
};

export default Carousel;