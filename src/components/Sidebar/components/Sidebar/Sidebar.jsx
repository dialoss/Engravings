import React, {useRef, useState} from 'react';
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import SidebarList from "../List/SidebarList";
import "./Sidebar.scss";
import "../Link/SidebarLink.scss";
import Slider from "ui/Slider/Slider";
import {useAddEvent} from "hooks/useAddEvent";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../../../helpers/events";
import {Auth} from "modules/Authorization";
import {Link} from "react-router-dom";
import Swipes from "../../../../ui/Swipes/Swipes";

const Sidebar = ({data, picker, customer}) => {
    const [isOpened, setOpened] = useState(false);
    const ref = useRef();
    const opRef = useRef();
    opRef.current = isOpened;

    function close() {
        setOpened(false);
    }

    const togglers = [
        {
            element: <WindowButton type={'open'} style={{visibility: isOpened ? "hidden": "visible"}}/>,
            action: 'open',
            callback: () => {
                setOpened(true);
            },
        },
        {
            element: <WindowButton type={'close'} style={{visibility: isOpened ? "visible": "hidden"}}/>,
            action: 'close',
            callback: close,
        },
    ];

    function toggleSidebar(event) {
        const el = getElementFromCursor(event, '', ['sidebar', 'window-button']);
        if (!el && opRef.current && isMobileDevice())
            close();
    }

    useAddEvent("sidebar:toggle", toggleSidebar);
    useAddEvent("mousedown", toggleSidebar);
    useAddEvent("touchstart", toggleSidebar);

    return (
        <Swipes callback={setOpened} state={isOpened} className={'sidebar'}>
            <div className="sidebar">
                <Slider togglers={togglers} defaultOpened={isOpened}>
                    <div className="sidebar__wrapper" ref={ref}>
                        <div className="sidebar__inner">
                            <Auth>
                                {customer && <Link to={'/customer/'}></Link>}
                            </Auth>
                            {picker && <div onClick={() => triggerEvent("filemanager-window:toggle", {toggle:true})}
                                            className={"sidebar__link"}
                                            style={{marginTop: 5}}>
                                Хранилище</div>}
                            <div className="sidebar__list-wrapper">
                                <SidebarList list={data}></SidebarList>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>
        </Swipes>
    );
};

export default Sidebar;