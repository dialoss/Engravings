import React, {useEffect, useRef} from 'react';
import {useSwipeable} from "react-swipeable";
import {config} from "./config";
import {getElementFromCursor, triggerEvent} from "../../helpers/events";
import {getViewportWidth} from "../helpers/viewport";

const Swipes = ({callback, state, children, className}) => {
    const canSwipe = useRef(true);
    const swipes = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === 'Left' && state) callback(false);
        },
        ...config,
    });

    const elRef = useRef();

    const { ref } = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === 'Right' && !state && canSwipe.current) callback(true);
            canSwipe.current = true;
        },
        onSwipeStart: (e) => {
            let [x, y] = e.initial;
            if (className === 'sidebar') {
                if (x > getViewportWidth() / 3) {
                    canSwipe.current = false;
                    return;
                }
                const f = (isOpened) => canSwipe.current = isOpened;
                if (document.querySelector('.modal__background.opened:not(.bg-none)')) f(false);
                if (getElementFromCursor({clientX: x, clientY: y}, 'item-model')) f(false);
            } else {
                    let block = elRef.current.getBoundingClientRect();
                    if (block.left + block.width < x) {
                        canSwipe.current = false;
                    } else {
                        canSwipe.current = true;
                    }
                }
            },
        ...config,
    });

    const refPassthrough = (el) => {
        swipes.ref(el);
        elRef.current = el;
    }

    useEffect(() => {
        ref(document);
        return () => ref({});
    });
    return React.cloneElement(children, {...swipes, ref: refPassthrough});
};

export default Swipes;