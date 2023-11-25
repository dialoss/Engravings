import React, {useLayoutEffect, useState} from 'react';
import Timeline from "../../../Timeline/Timeline";
import {itemsFromStages, prepareStages} from "../../../Timeline/stages";

const ItemTimeline = ({data}) => {
    const [stages, setStages] = useState([]);
    useLayoutEffect(() => {
        setStages(prepareStages(data));
    }, [data]);
    return (
        <Timeline stages={prepareStages(data)}></Timeline>
    );
};

export default ItemTimeline;