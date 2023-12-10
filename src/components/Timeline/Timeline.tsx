//@ts-nocheck
import React from 'react';
import "./Timeline.scss";
import Item from "./Item/Item";
import {default as EntryItem} from "components/Item/Item";
import ActionButton from "../../ui/Buttons/ActionButton/ActionButton";
import {triggerEvent} from "../../helpers/events";

const Timeline = ({stages}) => {
    return (
        <div className={"timeline"}>
            <div className="timeline-wrapper">
                {
                    stages.map((stage, index) => {
                        // return <EntryItem item={stage} depth={2} key={stage.id}></EntryItem>
                        return <Item data={stage}
                                     all={stages.length - 1}
                                     count={index}
                                     key={stage.id}
                                     connector={index !== stages.length - 1}></Item>
                    })
                }
                <ActionButton modalToggle={false} onClick={() =>
                    triggerEvent("action:function", {name: 'add', args:'add'})}>Добавить шаг</ActionButton>
            </div>
        </div>
    );
};

export default Timeline;