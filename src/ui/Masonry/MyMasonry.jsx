import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./MyMasonry.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getViewportSize} from "ui/helpers/viewport";
import {useAddEvent} from "../../hooks/useAddEvent";
import {triggerEvent} from "../../helpers/events";
import {initContainerDimensions} from "../ObjectTransform/helpers";

const MyMasonry = React.forwardRef(function({maxColumns=1, forceColumns=0, children}, ref) {
    const [externalItems, setItems] = useState([]);
    const [layout, setLayout] = useState([]);
    const [count, setCount] = useState(maxColumns);
    const widthPoints = [400, 600, 800];
    const forceRef = useRef();
    forceRef.current = forceColumns;
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
    }, [maxColumns]);

    useLayoutEffect(() => {
        if (forceColumns !== 0) setCount(forceColumns);
        else setColumns();
    }, [forceColumns]);

    useLayoutEffect(() => {
        let newLayout = [];
        for (let i = 0; i < count; i++) {
            newLayout.push([]);
        }
        let ext = []
        for (let i = 0; i < children.length; i++) {
            if (children[i].props.item.group_order === 'tabs') ext.push(children[i]);
            else newLayout[i % count].push(children[i]);
        }
        setItems(ext);
        setLayout(newLayout);
    }, [count, children]);
    useAddEvent('resize', () => {
        forceRef.current === 0 && setColumns();
        for (const container of ref.current.querySelectorAll('.transform-container')) {
            initContainerDimensions({container})
        }
    });

    useEffect(() => {
        for (const container of ref.current.querySelectorAll('.transform-container')) {
            initContainerDimensions({container})
        }
    }, [layout]);
    return (
        <div className={"masonry__grid"} data-columns={count} ref={ref}>
            {
                externalItems.map(it => <>{it}</>)
            }
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