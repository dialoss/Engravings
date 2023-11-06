import React from 'react';
import Timeline from "../../../Timeline/Timeline";
import {prepareStages} from "../../../../pages/CustomerPage/components/stages";

const ItemTimeline = ({data}) => {
    return (
        <div>
            <Timeline stages={prepareStages(data)}></Timeline>
        </div>
    );
};

export default ItemTimeline;