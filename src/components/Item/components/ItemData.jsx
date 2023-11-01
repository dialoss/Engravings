import React, {useCallback, useEffect} from 'react';
import ItemImage from "./Image/ItemImage";
import ItemTable from "./Table/ItemTable";
import ItemFile from "./File/ItemFile";
import ItemTextfield from "./Textfield/ItemTextfield";
import ItemVideo from "./Video/ItemVideo";
import Viewer from "./Model/Viewer";
import {triggerEvent} from "helpers/events";
import ItemBase from "./Base/BaseItem";
import PageFrom from "./PageFrom/PageFrom";
import ItemTimeline from "./Timeline/ItemTimeline";
import ItemPrice from "./Price/ItemPrice";
import TimelineEntry from "./Timeline/TimelineEntry";
import ItemLink from "./Link/ItemLink";
import IntroItem from "./Intro/IntroItem";
import SubscriptionItem from "./Subscription/SubscriptionItem";

export const Components = {
    'base': ItemBase,
    'link': ItemLink,
    'page_from': PageFrom,
    'image': ItemImage,
    'table': ItemTable,
    'video': ItemVideo,
    'file': ItemFile,
    'model': Viewer,
    'textfield': ItemTextfield,
    'timeline': ItemTimeline,
    'timeline_entry': TimelineEntry,
    'price': ItemPrice,
    'intro': IntroItem,
    'subscription': SubscriptionItem,
}

const ItemData = ({data, props}) => {
    const loadCallback = () => {
        console.log('init')
        triggerEvent("container:init", {container: props.container, item: props.itemTransform});
    }
    useEffect(() => {
        loadCallback();
    }, [props]);
    return (
        <>
            {React.createElement(Components[data.type], {
                    style:props.style,
                    data,
                    loadCallback,
                    key: data.id
                })}
        </>
    );
};

export default ItemData;