import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Accordion from "./Accordion";
import {getElementFromCursor, triggerEvent} from "../../helpers/events";

const AccordionContainer = ({children, title, onlyButton=false, header=null, callback=null, defaultOpened=false}) => {
    const [isOpened, setOpened] = useState(defaultOpened);

    const handleChange = (event) => {
        if (onlyButton && !getElementFromCursor(event, 'toggle-button')) return;
        callback && callback(!isOpened);
        setOpened(opened => !opened);
    };

    useEffect(() => {
        if (!ref) return;
        const item = ref.current.closest('.item.depth-0');
        const container = item && item.querySelector('.transform-container');
        if (container) {
            const resizeObserver = new ResizeObserver(() => {
                triggerEvent('container:init', {container});
            });
            resizeObserver.observe(ref.current);
        }
    }, []);

    useLayoutEffect(() => {
        setOpened(defaultOpened)
    }, [defaultOpened]);

    const [height, setHeight] = useState(0);
    const ref = useRef();

    function throttle(f, delay) {
        let timer = 0;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => f.apply(this, args), delay);
        }
    }

    useEffect(() => {
        if (height.current && height.current !== 0) return;
        let child = ref.current.children[0];
        if (!child) return;
        const resizeObserver = new ResizeObserver(throttle(() => {
            setHeight(child.getBoundingClientRect().height);
        }, 10));
        resizeObserver.observe(child);
        return () => resizeObserver.unobserve(child);
    }, []);

    return (
        <Accordion toggle={handleChange}
                   isOpened={isOpened}
                   text={title} ref={ref}
                   height={height}
                   header={header}>
            {children}
        </Accordion>
    );
};

export default AccordionContainer;