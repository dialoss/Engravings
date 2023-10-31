import React from 'react';
import SubscriptionItem from "../Subscription/SubscriptionItem";

const TimelineEntry = ({data}) => {
    return (
        <div className={"timeline__entry"}>
            <SubscriptionItem data={data}></SubscriptionItem>
        </div>
    );
};

export default TimelineEntry;