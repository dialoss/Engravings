import React, {useLayoutEffect, useState} from 'react';
import Timeline from "../../../Timeline/Timeline";
import {itemsFromStages, prepareStages} from "../../../Timeline/stages";

const ItemTimeline = ({data}) => {
    let stages1 = prepareStages(data);
    let stages2 = prepareStages(data);
    // console.log(stages1, stages2)
    return (
        <Timeline stages={stages2}></Timeline>
    );
};

export default ItemTimeline;