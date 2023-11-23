import React, {useEffect, useRef, useState} from 'react';
import MyCanvas from "./Canvas";
import {AutodeskModel} from "ui/Viewer";

const Viewer = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        if (data.style === 'simple') return;
        const resizer = new ResizeObserver(() => {
            if (!ref.current || !window.autodeskViewers) return;
            let block = ref.current.getBoundingClientRect();
            window.autodeskViewers[data.id].impl.resize(block.width, block.height, true);
        });
        resizer.observe(ref.current);
        return () => {
            try {
                resizer.unobserve(ref.current);
            } catch (e) {}
        }
    }, []);
    return (
        <>
            <div className={"model-wrapper"} ref={ref} style={{height:'100%', flex: 1}}>
                {data.style !== 'simple' ? <AutodeskModel data={data}></AutodeskModel> :
                    <MyCanvas data={data}></MyCanvas>}
            </div>
        </>
    );
};

export default Viewer;