//@ts-nocheck
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./MyMasonry.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const MyMasonry = ({maxColumns=1, children}) => {
    const ref = useRef();
    const [layout, setLayout] = useState([]);
    const [count, setCount] = useState(maxColumns);
    const widthPoints = [400, 600, 800];
    function setColumns() {
        const [vw, vh] = [1200, 10];
        let newColumns = 0;
        widthPoints.forEach((point, index) => {
            if (vw >= point) {
                newColumns = index;
            }
        });
        if (newColumns + 1 <= maxColumns) {
            setCount(newColumns + 1);
        }
    }

    useLayoutEffect(() => {
        setColumns();
    }, [maxColumns]);

    useLayoutEffect(() => {
        let newLayout = [];
        for (let i = 0; i < count; i++) {
            newLayout.push([]);
        }
        let cnt = 0;
        for (let i = 0; i < children.length; i++) {
            newLayout[cnt++ % count].push(children[i]);
        }
        setLayout(newLayout);
    }, [count, children]);

    return (
        <div className={"masonry__grid"} data-columns={count} ref={ref}>
            {
                layout.map((column, i) =>
                    <div className={"masonry__column"}
                         style={{width: 100 / count + "%"}}
                         key={i}>
                        <TransitionGroup key={i} component={null}>
                            {
                                column.map((item) =>
                                        <CSSTransition key={item.key} timeout={200} classNames={"masonry__item"}>
                                    {item}
                                </CSSTransition>
                                )
                            }
                        </TransitionGroup>
                    </div>
                )
            }
        </div>
    );
};

export default MyMasonry;