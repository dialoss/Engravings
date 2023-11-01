import React, {useEffect, useRef} from 'react';
import {useSwipeable} from "react-swipeable";
import {config} from "./config";
import {getElementFromCursor, triggerEvent} from "../../helpers/events";

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
                const f = (isOpened) => canSwipe.current = !isOpened;
                triggerEvent('messenger-window:toggle:check-opened', f);
                f(getElementFromCursor({clientX: x, clientY: y}, 'item-model'));
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