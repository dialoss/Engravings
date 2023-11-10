import React from 'react';
import Separator from "../Separator/Separator";
import Dot from "../Dot/Dot";
import Connector from "../Connector/Connector";
import Body from "../Body/Body";
import AccordionContainer from "ui/Accordion/AccordionContainer";
import {default as EntryItem} from "components/Item/Item";

const Item = ({data, connector}) => {
    return (
        <div className={"timeline-item timeline-item--" + data.style}>
            <Separator>
                <Dot style={{backgroundColor:data.color}}></Dot>
                {connector &&
                    <Connector style={{
                        backgroundColor: data.color,
                    }}/>
                }
            </Separator>
            <Body>
                <AccordionContainer title={data.title} defaultOpened={!!data.items.length}>
                    <EntryItem item={data} depth={3}></EntryItem>
                </AccordionContainer>
            </Body>
        </div>
    );
};

export default Item;