import React, {useEffect, useState} from 'react';
import SidebarList from "../List/SidebarList";
import SidebarLink from "../Link/SidebarLink";
import {getLocation} from "hooks/getLocation";
import AccordionContainer from "ui/Accordion/AccordionContainer";

const SidebarItem = ({listItem}) => {
    const haveSublist = !!listItem.sublist.length;
    const [isOpened, setOpened] = useState(false);

    return (
        <div className={"sidebar__item item"}
             data-sublist={haveSublist}
             data-itemtype={'sidebar_link'}
             data-id={listItem.id}>
            <AccordionContainer defaultOpened={isOpened}
                                callback={setOpened}
                                onlyButton={true}
                                key={listItem.id}
                                header={
                <SidebarLink link={listItem.link}
                             haveSublist={haveSublist}
                             depth={listItem.depth}>
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