import React, {useState} from 'react';
import AccordionContainer from "ui/Accordion/AccordionContainer";
import {default as EntryItem} from "components/Item/Item";
import Separator from "../Separator/Separator";
import Dot from "../Dot/Dot";
import Connector from "../Connector/Connector";
import ActionButton from "../../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../../helpers/events";

export const Entry = ({data}) => {
    const [opened, setOpened] = useState(false);
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
                {(data.count !== data.all) && <Connector style={{
                    backgroundColor: data.color,
                    height: opened ? 10 : 20,
                }} name={'extra bottom'}/>}
            </Separator>
            {data.type === 'timeline_entry' ? <AccordionContainer callback={setOpened}
                                                                  title={data.title}
                                                                  defaultOpened={!!data.items.length} key={data.id}>
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
            <div className="timeline-item__inner">
                <EntryItem item={{...data, count, all}} depth={3}></EntryItem>
                {count === all && data.type !== 'timeline_entry' && <ActionButton modalToggle={false} onClick={() =>
                    triggerEvent("action:function", {name: 'add', args:'add'})}>Добавить запись</ActionButton>}
            </div>
        </div>
    );
};

export default Item;