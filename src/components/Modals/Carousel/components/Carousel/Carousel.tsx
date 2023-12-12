//@ts-nocheck
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
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {triggerEvent} from "../../../../../helpers/events";

const emptyPosition = {pos: 0, dx: 0, translate: 0, index: 0, side:0, moved:false};

const Carousel = ({group, type}) => {
    const [loading, setLoading] = useState({spinner: true, newImage: false});
    const item = group[1];
    const [position, setPosition] = useState(emptyPosition);
    const pos = useRef();
    pos.current = position;
    useLayoutEffect(()=>{
        // setTimeout(() => {
        //     setLoading(l => {
        //         if (l.newImage) return {...l, spinner: true};
        //         return {...l, spinner: false};
        //     });
        // }, 20);
        // setLoading(l => ({...l, newImage: true}))
    }, [item.url]);
    const [zoom, setZoom] = useState(0);
    const nav = useContext(CarouselContext);
    const [scale, setCurScale] = useState(1);
    function checkClose(e) {
        setCurScale(e.state.scale);
        if (e.state.scale === 1 && e.state.positionY < -50)
            window.modals.close("carousel")
    }

    const width = 200;
    function bounds(n) {
        if (n < -width) n = -width;
        if (n > width) n = width;
        return n;
    }
    function sign(n) {
        if (n < 0) return -1;
        if (n > 0) return 1;
        return 0;
    }
    const swipes = useSwipeable({
        onSwiping: d => {
            setPosition(p => ({...p, dx: d.deltaX, translate: p.pos + d.deltaX, moved: true}));
        },
        onSwipeStart: d => {
            setPosition(p => ({...p, pos: bounds(p.pos + p.dx), dx: 0}));
        },
        onSwiped: d => {
            console.log('!!!!!')
            let p = pos.current;
            let side = p.side;
            if (Math.abs(p.dx) > width / 3) side += sign(p.dx);
            if (side > 1) side = 1;
            if (side < -1) side = -1;

            setPosition(p => {
                return {
                    dx: 0,
                    pos: side * width,
                    translate: side * width,
                    side: side,
                }
            });
            if (side < 0) nav['right']();
            if (side > 0) nav['left']();
            setPosition(p => {
                return {
                    dx: 0,
                    pos: 0,
                    translate: 0,
                    side: 0,
                }
            });
        },
    });
    console.log(item)
    console.log(position)
    return (
        <div className={"carousel " + type}>
            <div className="carousel__content" onClick={e => {if (e.detail === 2) setZoom(z => (z + 1) % 3)}}
                 {...swipes}>
                    {
                        group.map((it, i) =>
                            <div className={"content-inner"} style={(i !== 1 || scale === 1) ? {'--index': (position.translate / width) + i - 1} : {}}>
                                <div className="content-container" style={scale !== 1 && i === 1 ? {zIndex: 1,transform: 'translate(-50%,-50%)',top:'50%',left:'50%', position:'fixed'}:{}}>
                                <TransformWrapper panning={{disabled: scale === 1}} doubleClick={{mode: zoom === 1 ? 'reset' : 'zoomIn'}}
                                                  key={item.url} onTransformed={checkClose} >
                                <TransformComponent>
                                    <img className="carousel__image"
                                         // onLoad={()=>setLoading({newImage: false, spinner: false})}
                                         onClick={e => e.stopPropagation()} onDragStart={e => e.preventDefault()}
                                         src={it.url} alt="" key={it.url}/>
                                </TransformComponent>
                                </TransformWrapper>
                                </div>
                            </div>
                        )
                    }
            </div>
            {/*{loading.spinner && <Spinner></Spinner>}*/}
            {/*{item.navigation && <CarouselNav></CarouselNav>}*/}
            <InfoBlock data={item} className={"info__block"}></InfoBlock>
        </div>
    );
};

export default Carousel;