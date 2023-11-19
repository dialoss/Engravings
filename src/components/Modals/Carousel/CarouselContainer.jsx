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
import store from "../../../store";
import {getCompressedImage} from "../../Item/components/Image/helpers";

function bounds(n, bound) {
    return (n + bound) % bound;
}

function prepareContent(items) {
    let newContent = [];
    Object.values(items).forEach(item => {
        if (item.type !== 'image') return;
        const itemsAll = store.getState().elements.items;
        const parent = [...Object.values(items), ...Object.values(itemsAll)].find(it => it.id === item.parent) || {};
        newContent.push({
            navigation: item.navigation === undefined ? true : item.navigation,
            id: item.id,
            url: getCompressedImage(item, 1500),
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
    const clearContent = {items:[{}],item:0};
    const windowName = 'carousel-window:toggle';
    const contentRef = useRef();
    const [content, setContent] = useState(clearContent);
    contentRef.current = content;

    function openCarousel(event) {
        setContent({items:prepareContent([{...event.detail}]), item:0});
        triggerEvent(windowName, {isOpened: true});
        return;
        for (let i = 0; i < contentRef.current.items.length; i++) {
            if (contentRef.current.items[i].id === event.detail) {
                setContent(c => ({...c, item:i}));
                return;
            }
        }
    }
    useAddEvent("carousel:open", openCarousel);
    return (
        <>
            {content.items[content.item] && <ModalManager name={windowName} key={windowName}>
                <CarouselContainer style={{win: 'centered'}}
                                   items={content.items}
                                   item={content.item} type={'popup'}/>
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
    console.log(itemsRef.current)
    const [currentItem, setCurrent] = useState(0);
    useLayoutEffect(() => {
        setCurrent(item);
        setItem(items[currentItem]);
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

    return (
        <CarouselContext.Provider value={{right: forward, left: back}}>
            <div className={'carousel-events'}>
                {!!items[item] && <Carousel type={type}
                                         {...props}
                                         item={items[item]}/>}
            </div>
        </CarouselContext.Provider>

    );
};

export default CarouselContainer;
