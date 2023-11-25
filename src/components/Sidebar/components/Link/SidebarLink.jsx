import React from 'react';
import {darkenColor} from "../rgbmanip";
import styles from "./SidebarLink.scss";
import {getLocation} from "hooks/getLocation";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const linkColor = styles.linkColor;

const SidebarLink = ({link, children, depth, haveSublist}) => {
    const location = useSelector(state => state.location);
    const isCurrent = location.relativeURL === link;
    let style = {
        backgroundColor: darkenColor(linkColor, depth * 10 / 100),
        ...(haveSublist ? {paddingLeft: "20px"} : {})
    };
    // console.log(style)
    return (
        <div className={"sidebar__link-wrapper"}>
            <Link className={"sidebar__link " + (isCurrent ? 'sidebar__link--current' : '')}
                  to={link}
                  style={style} onMouseDown={e => {
                      if (e.button === 2) {
                          e.preventDefault();
                          e.stopPropagation();
                      }
            }}>{children}
            </Link>
        </div>
    );
};

export default SidebarLink;