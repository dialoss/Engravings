import React, {useEffect, useRef, useState} from 'react';
import MyCanvas from "./Canvas";
import {Test} from "ui/Viewer";

const Viewer = ({data}) => {
    const ref = useRef();
    useEffect(() => {
        if (!window.autodeskViewer) return;
        const resizer = new ResizeObserver(() => {
            let block = ref.current.getBoundingClientRect();
            window.autodeskViewer.impl.resize(block.width, block.height, true);
        });
        resizer.observe(ref.current);
        return () => resizer.unobserve(ref.current);
    }, []);
    return (
        <>
            <div className={"model-wrapper"} ref={ref}>
                {!!data.urn ? <Test urn={data.urn}></Test> :
                    <MyCanvas url={data.url}></MyCanvas>}
            </div>
        </>
    );
};

export default Viewer;