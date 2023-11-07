import React from 'react';
import Timeline from "../../../Timeline/Timeline";
import {itemsFromStages, prepareStages} from "../../../Timeline/stages";
import Item from "../../Item";

const ItemTimeline = ({data}) => {
    //console.log(data)
    return (
        <div>
            <Timeline stages={prepareStages(data)}></Timeline>
            {/*<Item item={{type: 'base', items: itemsFromStages(data)}} depth={0}></Item>*/}
        </div>
    );
};

export default ItemTimeline;