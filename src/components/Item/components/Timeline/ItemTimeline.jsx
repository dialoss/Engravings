import React from 'react';
import Timeline from "../../../Timeline/Timeline";
import {itemsFromStages, prepareStages} from "../../../Timeline/stages";

const ItemTimeline = ({data}) => {
    return (
        <div>
            <Timeline stages={prepareStages(data)}></Timeline>
        </div>
    );
};

export default ItemTimeline;