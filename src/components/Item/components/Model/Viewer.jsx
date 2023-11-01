import React, {useEffect, useRef, useState} from 'react';
import MyCanvas from "./Canvas";
import {Test} from "ui/Viewer";

const Viewer = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        const resizer = new ResizeObserver(() => {
            if (!ref.current || !window.autodeskViewer) return;
            let block = ref.current.getBoundingClientRect();
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
            <div className={"model-wrapper"} ref={ref} style={{height:'500px'}}>
                {!!data.urn ? <Test urn={data.urn}></Test> :
                    <MyCanvas url={data.url}></MyCanvas>}
            </div>
        </>
    );
};

export default Viewer;