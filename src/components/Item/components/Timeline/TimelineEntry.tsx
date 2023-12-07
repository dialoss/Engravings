import React from 'react';
import SubscriptionItem from "../Subscription/SubscriptionItem";
import {Entry} from "../../../Timeline/Item/Item";
import Item from "../../Item";

const TimelineEntry = ({data}) => {
    return (
        <div className={"timeline__entry"}>
            <SubscriptionItem data={{...data, title:''}}></SubscriptionItem>
            <Entry data={data}></Entry>
            {/*{*/}
            {/*    data.items.map((item, index) => {*/}
            {/*        return <Item item={item} depth={3} key={item.id}></Item>*/}
            {/*    })*/}
            {/*}*/}
        </div>
    );
};

export default TimelineEntry;