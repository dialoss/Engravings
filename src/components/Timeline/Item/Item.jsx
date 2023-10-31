import React from 'react';
import Separator from "../Separator/Separator";
import Dot from "../Dot/Dot";
import Connector from "../Connector/Connector";
import Body from "../Body/Body";
import AccordionContainer from "ui/Accordion/AccordionContainer";
import {default as EntryItem} from "components/Item/Item";

const Item = ({data, type, connector}) => {
    return (
        <div className={"timeline-item timeline-item--" + type}>
            <Separator>
                <Dot style={{backgroundColor:data.color.top}}></Dot>
                {connector &&
                    <Connector style={{
                        // background: `linear-gradient(${data.color.top}, ${data.color.bottom})`,
                        backgroundColor: data.color.top,
                    }}/>
                }
            </Separator>
            <Body>
                <AccordionContainer title={data.title}>
                    {/*<EntryItem item={data}></EntryItem>*/}
                </AccordionContainer>
            </Body>
        </div>
    );
};

export default Item;