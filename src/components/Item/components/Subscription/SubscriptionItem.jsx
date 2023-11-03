import React from 'react';
import InfoBlock from "../../../../ui/InfoBlock/InfoBlock";

const SubscriptionItem = ({data}) => {
    return (
        <div className={"item__info"} style={{height:'100%'}}>
            <InfoBlock data={data}></InfoBlock>
        </div>
    );
};

export default SubscriptionItem;