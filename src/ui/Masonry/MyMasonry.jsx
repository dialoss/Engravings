import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./MyMasonry.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getViewportSize} from "ui/helpers/viewport";
import {useAddEvent} from "../../hooks/useAddEvent";
import {triggerEvent} from "../../helpers/events";

const MyMasonry = React.forwardRef(function({maxColumns=1, widthPoints=[400,600,800], forceColumns=0, children}, ref) {
    const [layout, setLayout] = useState([]);
    const [count, setCount] = useState(maxColumns);

    function setColumns() {
        const [vw, vh] = getViewportSize();
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
    }, [maxColumns, widthPoints]);

    useLayoutEffect(() => {
        if (forceColumns !== 0) setCount(forceColumns);
        else setColumns();
    }, [forceColumns]);

    useLayoutEffect(() => {
        let newLayout = [];
        for (let i = 0; i < count; i++) {
            newLayout.push([]);
        }
        for (let i = 0; i < children.length; i++) {
            newLayout[i % count].push(children[i]);
        }
        for (let i = 0; i < newLayout.length; i++) {
            // const lastItem = newLayout[i].slice(-1)[0];
            // if (!!lastItem && !!lastItem.ref) console.log(lastItem.ref.current.offsetBottom); // make masonry columns equal height
        }
        setLayout(newLayout);
    }, [children, count]);

    useEffect(() => {
        for (const container of ref.current.querySelectorAll('.transform-container')) {
            // console.log(container)
            triggerEvent("container:init", {container, resize:true});
        }
    }, [layout]);

    useAddEvent('resize', setColumns);

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
});

export default MyMasonry;