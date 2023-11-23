import React from 'react';
import SubscriptionItem from "../Subscription/SubscriptionItem";
import Item, {Entry} from "../../../Timeline/Item/Item";

const TimelineEntry = ({data}) => {
    return (
        <div className={"timeline__entry"}>
            <SubscriptionItem data={{...data, title:''}}></SubscriptionItem>
            <Entry data={data}></Entry>

        </div>
    );
};

export default TimelineEntry;