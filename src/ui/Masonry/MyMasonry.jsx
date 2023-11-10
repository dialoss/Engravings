import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import "./MyMasonry.scss";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getViewportSize} from "ui/helpers/viewport";
import {useAddEvent} from "../../hooks/useAddEvent";
import {triggerEvent} from "../../helpers/events";
import {initContainerDimensions} from "../ObjectTransform/helpers";

const MyMasonry = React.forwardRef(function({maxColumns=1, forceColumns=0, children}, ref) {
    const [layout, setLayout] = useState([]);
    const [count, setCount] = useState(maxColumns);
    const widthPoints = [400, 600, 800];
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
        for (let i = 0; i < children.length; i++) {
            newLayout[i % count].push(children[i]);
        }
        setLayout(newLayout);
    }, [count, children]);

    useAddEvent('resize', () => {
        setColumns();
        for (const container of ref.current.querySelectorAll('.transform-container')) {
            initContainerDimensions({container})
        }
    });

    useEffect(() => {
        for (const container of ref.current.querySelectorAll('.transform-container')) {
            initContainerDimensions({container})
        }
        // for (const container of ref.current.querySelectorAll('.transform-container')) {
        //     initContainerDimensions({container})
        // }
        // setTimeout(() => {
        //     let ma = [0,0,null];
        //     let mi = [1e9,0,null];
        //     for (let i = 0; i < layout.length; i++) {
        //         if (!layout[i].length) continue;
        //         const lastItem = layout[i].slice(-1)[0].props.item.id;
        //         const it = document.querySelector(`.item[data-id="${lastItem}"]`).closest('.transform-item');
        //         const top = it.offsetTop;
        //         const h = it.getBoundingClientRect().height;
        //         if (ma[0] < top) ma = [top,h, it, i];
        //         if (mi[0] > top) mi = [top, h, it, i];
        //     }
        //     console.log(ma, mi)
        //     if (mi[0] + ma[1] < ma[0]) {
        //         setLayout(l => {
        //             let n = [...l];
        //             n[mi[3]].push(n[ma[3]]);
        //             n[ma[3]].pop();
        //             return n;
        //         })
        //     }
        // }, 100);
    }, [layout]);
    // console.log(layout)
    // console.log(count)
    return (
        <div className={"masonry__grid"} data-columns={count} ref={ref}>
            {
                layout.map((column, i) =>
                    <div className={"masonry__column"}
                         style={{width: 100 / count + "%"}}
                         key={i}>
                        {/*<TransitionGroup key={i} component={null}>*/}
                            {
                                column.map((item) =>
                                <>
                                    {item}
                                </>
                                )
                            }
                        {/*</TransitionGroup>*/}
                    </div>
                )
            }
        </div>
    );
});

export default MyMasonry;