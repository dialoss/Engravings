import React from 'react';
import AccordionContainer from "ui/Accordion/AccordionContainer";
import {default as EntryItem} from "components/Item/Item";
import SubscriptionItem from "../../Item/components/Subscription/SubscriptionItem";
import Separator from "../Separator/Separator";
import Dot from "../Dot/Dot";
import Connector from "../Connector/Connector";

export const Entry = ({data}) => {
    const items = data.items.map((item, index) => {
        return <Item data={item}></Item>
    });
    return (
        <div className={'timeline-body'}>
            <div className={'timeline-separators'}>
                {
                    data.items.map((item, index) => {
                        return <Separator>
                            <Dot style={{backgroundColor:data.color}}></Dot>
                            <Connector style={{
                                backgroundColor: data.color,
                            }}/>
                        </Separator>
                    })
                }

            </div>

            {data.type === 'timeline_entry' ? <AccordionContainer title={data.title} defaultOpened={!!data.items.length}>
                <div>{items}</div>
            </AccordionContainer> : items}
        </div>
    );
}

const Item = ({data}) => {
    console.log(data)
    return (
        <div className={"timeline-item " + data.style}>
            <EntryItem item={data} depth={3}></EntryItem>
        </div>
    );
};

export default Item;