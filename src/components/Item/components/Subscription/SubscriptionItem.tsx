//@ts-nocheck
import React from 'react';
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";

const SubscriptionItem = ({data, extra}) => {
    return (
        <div className={"item__info"} style={{height:'100%'}}>
            <InfoBlock data={data}></InfoBlock>
            {extra}
        </div>
    );
};

export default SubscriptionItem;