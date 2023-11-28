import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./Carousel.scss";
import InfoBlock from "../../../../../ui/InfoBlock/InfoBlock";
import styles from "./Carousel.module.scss";
import CarouselNav from "../Navigation/Navigation";
import WindowButton from "../../../../../ui/Buttons/WindowButton/WindowButton";
import Spinner from "../../../../../ui/Spinner/Spinner";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import Swipes from "../../../../../ui/Swipes/Swipes";
import {useSwipeable} from "react-swipeable";
import {config} from "../../../../../ui/Swipes/config";
import {CarouselContext} from "../../CarouselContainer";

const Carousel = ({item, type}) => {
    const [loading, setLoading] = useState({spinner: true, newImage: false});
    useLayoutEffect(()=>{
        setTimeout(() => {
            setLoading(l => {
                if (l.newImage) return {...l, spinner: true};
                return {...l, spinner: false};
            });
        }, 20);
        setLoading(l => ({...l, newImage: true}))
    }, [item.url]);
    const [zoom, setZoom] = useState(0);
    const ratio = item.media_width / item.media_height;
    const nav = useContext(CarouselContext);

    const swipes = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === 'Left') nav['right']();
            if (eventData.dir === 'Right') nav['left']();
        },
        onSwipeStart: () => {
            console.log(1231)
        },
        ...config,
    });
    return (
        <div className={"carousel " + type}>
            <div className="carousel__content content-inner" onClick={e => {if (e.detail === 2) setZoom(z => (z + 1) % 3)}}  {...swipes}>
                {/*<TransformWrapper doubleClick={{mode: zoom === 1 ? 'reset' : 'zoomIn'}}*/}
                {/*                  key={item.url}>*/}
                    {/*<TransformComponent>*/}
                        <img className="carousel__image" style={{'--aspect-ratio': ratio}}
                             onLoad={()=>setLoading({newImage: false, spinner: false})}
                             onClick={e => e.stopPropagation()}
                             src={item.url} alt="" key={item.url}/>
                    {/*</TransformComponent>*/}
                {/*</TransformWrapper>*/}
            </div>
            <div className="content-outer">
                {loading.spinner && <Spinner></Spinner>}
                <InfoBlock data={item} className={styles['info__block']}></InfoBlock>
                {item.navigation && <CarouselNav></CarouselNav>}
                {/*<WindowButton type={'close'}></WindowButton>*/}
            </div>
        </div>
    );
};

export default Carousel;