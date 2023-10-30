import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Accordion from "./Accordion";

const AccordionContainer = ({children, title, header=null, callback=null, defaultOpened=false}) => {
    const [isOpened, setOpened] = useState(defaultOpened);

    const handleChange = () => {
        callback && callback(!isOpened);
        setOpened(opened => !opened);
    };

    useLayoutEffect(() => {
        setOpened(defaultOpened)
    }, [defaultOpened]);

    const [height, setHeight] = useState(0);
    const ref = useRef();
    // console.log(isOpened)
    useEffect(() => {
        if (height.current && height.current !== 0) return;
        let child = ref.current.children[0];
        if (!child) return;
        const resizeObserver = new ResizeObserver(() => {
            setHeight(child.getBoundingClientRect().height);
        });
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