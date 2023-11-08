import React, {
    createContext,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import Carousel from "./components/Carousel/Carousel.jsx";
import {triggerEvent} from "helpers/events";
import {useAddEvent} from "hooks/useAddEvent";
import {useSelector} from "react-redux";
import {ModalManager} from "components/ModalManager";

function bounds(n, bound) {
    return (n + bound) % bound;
}

function prepareContent(items) {
    let newContent = [];
    Object.values(items).forEach(item => {
        if (item.type !== 'image') return;
        const parent = Object.values(items).find(it => it.id === item.parent) || {};
        newContent.push({
            navigation: true,
            id: item.id,
            url: item.url,
            info: {
                title: item.title || parent.title,
                description: item.description || parent.description,
                filename: item.filename,
            }
        });
    })
    return newContent;
}

export const CarouselModal = () => {
    const windowName = 'carousel-window:toggle';
    const [item, setItem] = useState(0);
    const items = useSelector(state => state.elements.itemsAll);
    const contentRef = useRef();
    const [content, setContent] = useState([]);
    contentRef.current = content;

    useLayoutEffect(() => {
        setContent(prepareContent(items));
    }, [items]);

    function openCarousel(event) {
        for (let i = 0; i < contentRef.current.length; i++) {
            if (contentRef.current[i].id === event.detail) {
                setItem(i);
            }
        }
        triggerEvent(windowName, {isOpened: true});
    }
    useAddEvent("carousel:open", openCarousel);

    const carousel = content[item] && <CarouselContainer style={{win: 'centered'}}
                                        items={content}
                                        item={item} type={'popup'}/>;
    return (
        <>
            {carousel && <ModalManager name={windowName} key={windowName}>
                {carousel}
            </ModalManager>}
        </>
    );
}

export const CarouselInline = ({items}) => {
    const content = prepareContent(items);
    return (
        <CarouselContainer items={content} item={0} type={'inline'}></CarouselContainer>
    );
}

export const CarouselContext = createContext();

const CarouselContainer = ({items, item, type, ...props}) => {
    const itemsRef = useRef();
    itemsRef.current = items;
    const [currentItem, setCurrent] = useState(0);
    useLayoutEffect(() => {
        setCurrent(item);
    }, [item])

    const forward = () => setCurrent(currentItem => bounds(currentItem + 1, itemsRef.current.length));
    const back = () => setCurrent(currentItem => bounds(currentItem - 1, itemsRef.current.length));

    function nav(event) {
        event.key === 'ArrowRight' && forward();
        event.key === 'ArrowLeft' && back();
    }
    useAddEvent('keydown', nav);

    const [itemShow, setItem] = useState(null);
    useLayoutEffect(() => {
        setItem(items[currentItem]);
    }, [currentItem]);
    console.log(itemShow)
    return (
        <CarouselContext.Provider value={{right: forward, left: back}}>
            <div className={'carousel-events'}>
                {!!itemShow && <Carousel type={type}
                                         {...props}
                                         item={itemShow}/>}
            </div>
        </CarouselContext.Provider>

    );
};

export default CarouselContainer;
