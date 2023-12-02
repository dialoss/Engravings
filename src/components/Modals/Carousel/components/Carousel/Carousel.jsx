import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./Carousel.scss";
import InfoBlock from "../../../../../ui/InfoBlock/InfoBlock";
import CarouselNav from "../Navigation/Navigation";
import WindowButton from "../../../../../ui/Buttons/WindowButton/WindowButton";
import Spinner from "../../../../../ui/Spinner/Spinner";
import {useSwipeable} from "react-swipeable";
import {config} from "../../../../../ui/Swipes/config";
import {CarouselContext} from "../../CarouselContainer";
import {getViewportWidth} from "../../../../../ui/helpers/viewport";


const Carousel = ({group, type}) => {
    const [loading, setLoading] = useState({spinner: true, newImage: false});
    const item = group[1];
    const emptyPosition = {pos: -getViewportWidth(), dx: 0, translate: -getViewportWidth()};
    const [position, setPosition] = useState(emptyPosition);
    const pos = useRef();
    pos.current = position;
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
    const nav = useContext(CarouselContext);

    // const swipes = {
    //     onSwipeEnd: (data) => {
    //         console.log(data)
    //     },
    //     onSwipeStart: d => transformItem({...d, checkBounds: false})
    // };

    const swipes = useSwipeable({
        onSwiping: d => {
            // if (pos.current.pos + d.deltaX > getViewportWidth()) nav['right']();
            // if (pos.current.pos + d.deltaX < -getViewportWidth()) nav['left']();
            setPosition(p => ({...p, dx: d.deltaX, translate: p.pos + d.deltaX}));
        },
        onSwipeStart: d => {
            setPosition(p => ({...p, pos: p.pos + p.dx, dx: 0}));
        },
        onSwiped: d => {
            if (d.deltaX < 0) setPosition(p => ({pos: p.pos - getViewportWidth(),dx:d.deltaX}));
            // else setPosition(p => ({pos: p.pos + getViewportWidth(),dx:d.deltaX, translate: }));
        },
    });
    console.log(position)
    return (
        <div className={"carousel " + type}>
            <div className="carousel__content" onClick={e => {if (e.detail === 2) setZoom(z => (z + 1) % 3)}}
                 {...swipes} style={{transform:`translateX(${position.translate}px)`}}>
                    {
                        group.map(it =>
                            <div className={"content-inner"}>
                                    <img className="carousel__image"
                                         onLoad={()=>setLoading({newImage: false, spinner: false})}
                                         onClick={e => e.stopPropagation()} onDragStart={e => e.preventDefault()}
                                         src={it.url} alt="" key={it.url}/>
                            </div>
                        )
                    }
            </div>
            {loading.spinner && <Spinner></Spinner>}
            {item.navigation && <CarouselNav></CarouselNav>}
            <InfoBlock data={item} className={"info__block"}></InfoBlock>
        </div>
    );
};

export default Carousel;