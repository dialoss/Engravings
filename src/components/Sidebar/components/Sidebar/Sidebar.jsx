import React, {useEffect, useRef, useState} from 'react';
import WindowButton from "ui/Buttons/WindowButton/WindowButton";
import SidebarList from "../List/SidebarList";
import "./Sidebar.scss";
import "../Link/SidebarLink.scss";
import Slider from "ui/Slider/Slider";
import {useAddEvent} from "hooks/useAddEvent";
import {getElementFromCursor, isMobileDevice, triggerEvent} from "../../../../helpers/events";
import Auth from "modules/Authorization/components/Auth";
import {Link} from "react-router-dom";
import Swipes from "../../../../ui/Swipes/Swipes";
import ActionButton from "../../../../ui/Buttons/ActionButton/ActionButton";
import {getLocation} from "../../../../hooks/getLocation";
import Avatar from "../../../../ui/Avatar/Avatar";
import {useSelector} from "react-redux";


const Customer = () => {
    const user = useSelector(state => state.users.current);
    return (
        <div className={"user-profile " + ((getLocation().relativeURL === '/customer/') ? 'active' : '')}>
            {user.authenticated && <div className="wrapper">
                <Link to={'/customer/'}></Link>
                <Avatar src={user.picture} user={user}></Avatar>
                <h3>{user.name}</h3>
            </div>}
            <Auth></Auth>
        </div>
    );
}

const Sidebar = ({data, admin}) => {
    const [isOpened, setOpened] = useState(false);
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
        console.log(event)
        if (event.detail.isOpened !== undefined) {
            setOpened(event.detail.isOpened);
            return;
        }
        const el = getElementFromCursor(event, '', ['sidebar', 'window-button']);
        if (!el && opRef.current && isMobileDevice())
            close();
    }

    useAddEvent("sidebar:toggle", toggleSidebar);
    useAddEvent("mousedown", toggleSidebar);
    useAddEvent("touchstart", toggleSidebar);

    useEffect(() => {
        for (const link of document.querySelectorAll(".sidebar__link")) {
            link.addEventListener('mousedown', () => toggleSidebar({detail:{isOpened: false}}));
        }
    }, []);

    return (
        <Swipes callback={setOpened} state={isOpened} className={'sidebar'}>
            <div className="sidebar">
                <Slider togglers={togglers} defaultOpened={isOpened}>
                    <div className={"sidebar__block"}>
                    <div className={'sidebar__wrapper sidebar__outer'}>
                        <div className="sidebar__inner">
                        <Customer></Customer>
                        {admin && <>
                            <ActionButton onClick={() => triggerEvent("filemanager-window:toggle", {toggle:true})}
                                 className={"sidebar__action sidebar__link"}>Хранилище</ActionButton>
                            <ActionButton onClick={() => triggerEvent("theme:toggle")}
                                 className={"sidebar__action sidebar__link"}>Редактор</ActionButton>
                        </>}
                            <ActionButton onClick={() => triggerEvent("messenger-window:toggle", {toggle:true})}
                                 className={"sidebar__action sidebar__link"}>сообщения</ActionButton>
                        </div>
                    </div>
                    <div className="sidebar__wrapper scrollable">
                        <div className="sidebar__inner">
                            <div className="sidebar__list-wrapper">
                                <SidebarList list={data}></SidebarList>
                            </div>
                        </div>
                    </div>
                    </div>
                </Slider>
            </div>
        </Swipes>
    );
};

export default Sidebar;