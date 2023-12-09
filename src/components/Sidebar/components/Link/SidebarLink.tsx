import React from 'react';
import {darkenColor} from "../rgbmanip";
import {Link} from "react-router-dom";
import {useAppSelector} from "hooks/redux";
import {isMobileDevice, triggerEvent} from "../../../../helpers/events";

const SidebarLink = ({link, children, depth, haveSublist}) => {
    const location = useAppSelector(state => state.location);
    const isCurrent = location.relativeURL === link;
    let style = {
        backgroundColor: darkenColor('rgb(235, 239, 242)', depth * 10 / 100),
        ...(haveSublist ? {paddingLeft: "20px"} : {})
    };
    return (
        <div className={"sidebar__link-wrapper"}>
            <Link className={"sidebar__link " + (isCurrent ? 'sidebar__link--current' : '')}
                  to={link}
                  style={style} onMouseDown={e => {
                      if (e.button === 2) {
                          e.preventDefault();
                          e.stopPropagation();
                      } else {
                          isMobileDevice() && triggerEvent("sidebar:toggle", {isOpened: false});
                      }
            }}>{children}
            </Link>
        </div>
    );
};

export default SidebarLink;