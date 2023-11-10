import React, {useEffect, useRef, useState} from 'react';
import MyCanvas from "./Canvas";
import {AutodeskModel} from "ui/Viewer";

const Viewer = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        const resizer = new ResizeObserver(() => {
            if (!ref.current || !window.autodeskViewer) return;
            let block = ref.current.getBoundingClientRect();
            console.log(ref.current)
            window.autodeskViewer.impl.resize(block.width, block.height, true);
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
                {!!data.urn ? <AutodeskModel data={data}></AutodeskModel> :
                    <MyCanvas url={data.url}></MyCanvas>}
            </div>
        </>
    );
};

export default Viewer;