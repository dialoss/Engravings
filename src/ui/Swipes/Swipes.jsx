import React, {useEffect, useRef} from 'react';
import {useSwipeable} from "react-swipeable";
import {config} from "./config";
import {triggerEvent} from "../../helpers/events";

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
            if (className === 'sidebar') {
                const f = (isOpened) => canSwipe.current = !isOpened;
                triggerEvent('messenger-window:toggle:check-opened', f);
            } else {
                    let [x, y] = e.initial;
                    let block = elRef.current.getBoundingClientRect();
                    if (block.left + block.width < x) {
                        canSwipe.current = false;
                    } else {
                        canSwipe.current = true;
                    }
                }
            },
            // e = {...e, clientX:x, clientY:y};
            // let el = getElementFromCursor(e, className);
            // let msg = getElementFromCursor(e, 'messenger');
            // let sidebar = getElementFromCursor(e, 'sidebar');
            // if (msg && sidebar && className === 'sidebar') {
            //     canSwipe.current = false;
            // }
            // else if (!el)
            //     canSwipe.current = false;
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