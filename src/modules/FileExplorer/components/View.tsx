//@ts-nocheck
import React, {useEffect, useRef, useState} from 'react';
import {ExplorerViews} from "../config";
import {getElementFromCursor} from "../../../helpers/events";

const View = ({children} : {children: React.ReactNode}) => {
    const scale = useRef<number>(4);
    const ref = useRef<HTMLElement>(null);
    const [view, setView] = useState(0);
    function changeView() {
        setView(v => (v + 1) % ExplorerViews.length);
    }

    useEffect(() => {
        if(window.filemanager) window.filemanager.changeView = changeView;
    }, [window.filemanager]);

    useEffect(() => {
        ref.current.style.setProperty('--icon-size', scale.current + 'em');
        ref.current.style.setProperty('--scale', scale.current);

        const zoomController = (e) => {
            if(e.ctrlKey) {
                if (!getElementFromCursor(e, 'fe_fileexplorer_wrap')) return;
                e.preventDefault();
                e.stopPropagation();
                if (e.deltaY < 0) {
                    scale.current = Math.min(15, (scale.current + 1));
                } else {
                    scale.current = Math.max(1, (scale.current - 1));
                }
                ref.current.style.setProperty('--icon-size', scale.current + 'em');
                ref.current.style.setProperty('--scale', scale.current);
            }
        };
        window.addEventListener('mousewheel', zoomController, {passive: false});
        return () => window.removeEventListener('mousewheel', zoomController);
    }, []);

    return (
        <div className={"filemanager-view " + ExplorerViews[view]} ref={ref}>
            {children}
        </div>
    );
};

export default View;