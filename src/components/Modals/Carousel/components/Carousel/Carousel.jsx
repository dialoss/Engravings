import React, {useLayoutEffect, useState} from 'react';
import "./Carousel.scss";
import InfoBlock from "../../../../../ui/InfoBlock/InfoBlock";
import styles from "./Carousel.module.scss";
import CarouselNav from "../Navigation/Navigation";
import WindowButton from "../../../../../ui/Buttons/WindowButton/WindowButton";
import Spinner from "../../../../../ui/Spinner/Spinner";

const Carousel = ({item, type}) => {
    const [loading, setLoading] = useState(true);
    useLayoutEffect(()=>{
        setLoading(true);
    }, [item.url]);
    return (
        <div className={"carousel " + type}>
            <div className="carousel__content content-inner">
                <img className="carousel__image"
                     onLoad={()=>setLoading(false)}
                     src={item.url} alt="" key={item.url}/>
            </div>
            <div className="content-outer">
                {loading && <Spinner></Spinner>}
                {item.info && <InfoBlock data={item.info} className={styles['info__block']}></InfoBlock>}
                {/*{item.navigation && <CarouselNav></CarouselNav>}*/}
                {/*<WindowButton type={'close'} className={styles['window-close']}/>*/}
            </div>
        </div>
    );
};

export default Carousel;