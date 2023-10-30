import React, {useEffect, useState} from 'react';
import SidebarList from "../List/SidebarList";
import SidebarLink from "../Link/SidebarLink";
import {getLocation} from "hooks/getLocation";
import AccordionContainer from "ui/Accordion/AccordionContainer";

const SidebarItem = ({listItem}) => {
    const haveSublist = !!listItem.sublist.length;
    const [isOpened, setOpened] = useState(false);
    const parentLink = getLocation().parentURL;

    useEffect(() => {
        if (parentLink === listItem.link) setOpened(true);
    }, [parentLink]);

    return (
        <div className="sidebar__item">
            <AccordionContainer defaultOpened={isOpened} header={
                <SidebarLink link={listItem.link}
                             haveSublist={haveSublist}
                             depth={listItem.depth}
                             callback={() => setOpened(!isOpened)}>
                {listItem.text}</SidebarLink>
            }>
            {haveSublist &&
                <SidebarList list={listItem}>
                </SidebarList>
            }
            </AccordionContainer>
        </div>
    );
};

export default SidebarItem;