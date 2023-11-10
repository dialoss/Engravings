import React from 'react';
import "./Carousel.scss";
import InfoBlock from "../../../../../ui/InfoBlock/InfoBlock";
import styles from "./Carousel.module.scss";
import CarouselNav from "../Navigation/Navigation";
import WindowButton from "../../../../../ui/Buttons/WindowButton/WindowButton";

const Carousel = ({item, type}) => {
    return (
        <div className={"carousel " + type}>
            <div className="carousel__content content-inner">
                <img className="carousel__image" src={item.url} alt=""/>
            </div>
            <div className="content-outer">
                {item.info && <InfoBlock data={item.info} className={styles['info__block']}></InfoBlock>}
                {/*{item.navigation && <CarouselNav></CarouselNav>}*/}
                <WindowButton type={'close'} className={styles['window-close']}/>
            </div>
        </div>
    );
};

export default Carousel;