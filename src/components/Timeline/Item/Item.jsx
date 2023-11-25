import React from 'react';
import AccordionContainer from "ui/Accordion/AccordionContainer";
import {default as EntryItem} from "components/Item/Item";
import Separator from "../Separator/Separator";
import Dot from "../Dot/Dot";
import Connector from "../Connector/Connector";

export const Entry = ({data}) => {
    const items = data.items.map((item, index) => {
        return <Item data={item} separator={true} count={index} all={data.items.length - 1} key={item.id}></Item>
    });
    return (
        <div className={'timeline-body ' + data.style}>
            <Separator>
                {data.count !== 0 && <Connector style={{
                    backgroundColor: data.colorPrev,
                }} name={'extra top'}/>}
                <Dot style={{backgroundColor:data.color}}></Dot>
                {data.all !== data.count && <Connector style={{
                    backgroundColor: data.color,
                }} name={'extra bottom'}/>}
            </Separator>
            {data.type === 'timeline_entry' ? <AccordionContainer title={data.title} defaultOpened={!!data.items.length}>
                <div className={'timeline-group'}>{items}</div>
            </AccordionContainer> : items}
        </div>
    );
}

const Item = ({data, separator, count, all}) => {
    return (
        <div className={"timeline-item " + data.style}>
            {data.type !== 'timeline_entry' && <Separator>
                <Connector style={{
                    backgroundColor: data.color,
                    margin: '0 0 3px 0',
                    border: count === 0 ? '4px' : '0 0 4px 4px',
                }}/>
                {separator && <>
                <Dot style={{backgroundColor:data.color}}></Dot>
                <Connector style={{
                        backgroundColor: data.color,
                        margin: '3px 0 0 0',
                        border: count === all ? '4px' : '4px 4px 0 0',
                    }}/>
                </>
                }
            </Separator>}
            <EntryItem item={{...data, count, all}} depth={3}></EntryItem>
        </div>
    );
};

export default Item;