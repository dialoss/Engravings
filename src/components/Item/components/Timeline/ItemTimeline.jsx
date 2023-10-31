import React from 'react';
import Timeline from "../../../Timeline/Timeline";
import {prepareColors, Stages} from "../../../../pages/CustomerPage/components/stages";

const ItemTimeline = ({data}) => {
    console.log(data)
    const stages = structuredClone(Stages);
    // data.items.forEach()
    return (
        <div>
            <Timeline stages={prepareColors(Stages)}></Timeline>
        </div>
    );
};

export default ItemTimeline;