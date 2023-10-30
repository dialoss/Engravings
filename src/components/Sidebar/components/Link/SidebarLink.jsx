import React from 'react';
import {darkenColor} from "../rgbmanip";
import styles from "./SidebarLink.scss";
import {getLocation} from "hooks/getLocation";
import {Link} from "react-router-dom";
import {triggerEvent} from "helpers/events";

const linkColor = styles.linkColor;

const SidebarLink = ({link, children, depth, haveSublist, callback}) => {
    const location = getLocation();
    const isCurrent = location.relativeURL === link;
    let style = {
        ...(!isCurrent ? {backgroundColor: darkenColor(linkColor, depth * 10 / 100)} : {}),
        ...(haveSublist ? {paddingLeft: "20px"} : {})
    };
    return (
        <div className={"sidebar__link-wrapper"}>
            <Link className={"sidebar__link " + (isCurrent ? 'sidebar__link--current' : '')}
                  onClick={() => triggerEvent("sidebar:toggle")}
                  to={link}
                  style={style}>{children}
            </Link>
            {haveSublist && <button className="sidebar__link-btn" onClick={callback}></button>}
        </div>
    );
};

export default SidebarLink;