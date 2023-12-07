import React from 'react';
import SidebarItem from "../Item/SidebarItem";
import "./SidebarList.scss";

const SidebarList = ({list}) => {
    return (
        <div className={"sidebar__list"}>
            {
                list.sublist.map((item, index) => {
                    return <SidebarItem listItem={item}
                                        key={index}></SidebarItem>
                })
            }
        </div>
    );
};

export default SidebarList;