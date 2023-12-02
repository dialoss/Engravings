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
import {getCompressedImage} from "../../Item/components/Image/helpers";

function checkNear(n, items) {
    n = (n + items.length) % items.length;
    return items[n];
}

function bounds(position, side, items) {
    const n = items.current.length;
    position.current = position.current + side;
    position.current = (position.current + n) % n;
    let group = [-1, 0, 1].map(p => checkNear(position.current + p, items.current)).map(it =>
        prepareContent({...it, navigation: items.current.length > 1}));
    return group;
}

function prepareContent(item) {
    return {
        ...item,
        url: getCompressedImage(item, 1500),
    };
}

export const CarouselModal = ({name}) => {
    const windowName = 'carousel-window';
    const position = useRef();
    const [items, setItems] = useState([]);
    const itemsRef = useRef();
    itemsRef.current = items;
    const [group, setGroup] = useState(null);
    function openCarousel(event) {
        const items = event.detail.items;
        setItems(items);
        itemsRef.current = items;
        position.current = event.detail.item;
        setGroup(bounds(position, 0, itemsRef));
        triggerEvent(windowName + ':toggle', {isOpened: true});
    }
    console.log(items, group)
    console.log(group)
    useAddEvent("carousel:open", openCarousel);
    return (
        <ModalManager name={windowName} key={windowName}>
            <div style={{}}>
                {group && <CarouselContainer next={() => setGroup(bounds(position, 1, itemsRef))}
                                            previous={() => setGroup(bounds(position, -1, itemsRef))}
                                            group={group} type={'popup'}/>}
            </div>
        </ModalManager>
    );
}

export const CarouselInline = ({items}) => {
    const content = prepareContent(items);
    return (
        <CarouselContainer item={content[0]} type={'inline'}></CarouselContainer>
    );
}

export const CarouselContext = createContext();

const CarouselContainer = ({group, type, next, previous, ...props}) => {
    function nav(event) {
        if (!group[1].navigation) return;
        event.key === 'ArrowRight' && next();
        event.key === 'ArrowLeft' && previous();
    }
    useAddEvent('keydown', nav);

    return (
        <CarouselContext.Provider value={{right: next, left: previous}}>
            <div className={'carousel-events'}>
                {group && <Carousel type={type}
                                         {...props}
                                         group={group}/>}
            </div>
        </CarouselContext.Provider>

    );
};

export default CarouselContainer;
