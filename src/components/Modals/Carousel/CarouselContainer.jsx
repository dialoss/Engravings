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

function bounds(position, side, items) {
    const n = items.current.length;
    position.current = position.current + side;
    position.current = (position.current + n) % n;
    console.log(position.current)
    return items.current[position.current];
}

function prepareContent(item) {
    return {
        ...item,
        navigation: item.navigation === undefined ? true : item.navigation,
        url: getCompressedImage(item, 1500),
    };
}

export const CarouselModal = () => {
    const windowName = 'carousel-window';
    const [item, setItem] = useState(null);
    const position = useRef();

    const itemsRaw = useSelector(state => state.elements.pageItems);
    const [items, setItems] = useState([]);
    useLayoutEffect(() => {
        let newItems = [];
        for (const it of Object.values(itemsRaw)) {
            for (const child of it.items) {
                child.type === 'image' && newItems.push(prepareContent(child));
            }
        }
        setItems(newItems);
    }, [itemsRaw]);
    const itemsRef = useRef();
    itemsRef.current = items;
    function openCarousel(event) {
        console.log(event.detail)
        if (event.detail.navigation === false) {
            setItem(prepareContent(event.detail));
        } else {
            let index = 0;
            for (const it of itemsRef.current) {
                if (it.id === event.detail.id) {
                    position.current = index;
                    setItem(itemsRef.current[index]);
                }
                index += 1;
            }
        }
        triggerEvent(windowName + ':toggle', {isOpened: true});
    }
    useAddEvent("carousel:open", openCarousel);
    return (
        <ModalManager name={windowName} key={windowName}>
            <div style={{win: 'centered'}}>
                {item && <CarouselContainer next={() => setItem(bounds(position, 1, itemsRef))}
                                            previous={() => setItem(bounds(position, -1, itemsRef))}
                                            item={item} type={'popup'}/>}
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

const CarouselContainer = ({item, type, next, previous, ...props}) => {
    function nav(event) {
        if (!item.navigation) return;
        event.key === 'ArrowRight' && next();
        event.key === 'ArrowLeft' && previous();
    }
    useAddEvent('keydown', nav);

    return (
        <CarouselContext.Provider value={{right: next, left: previous}}>
            <div className={'carousel-events'}>
                {item && <Carousel type={type}
                                         {...props}
                                         item={item}/>}
            </div>
        </CarouselContext.Provider>

    );
};

export default CarouselContainer;
