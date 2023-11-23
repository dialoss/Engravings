import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import ItemImage from "./Image/ItemImage";
import ItemTable from "./Table/ItemTable";
import ItemFile from "./File/ItemFile";
import ItemTextfield from "./Textfield/ItemTextfield";
import ItemVideo from "./Video/ItemVideo";
import Viewer from "./Model/Viewer";
import ItemBase from "./Base/BaseItem";
import PageFrom from "./PageFrom/PageFrom";
import ItemTimeline from "./Timeline/ItemTimeline";
import ItemPrice from "./Price/ItemPrice";
import TimelineEntry from "./Timeline/TimelineEntry";
import ItemLink from "./Link/ItemLink";
import IntroItem from "./Intro/IntroItem";
import SubscriptionItem from "./Subscription/SubscriptionItem";
import ButtonItem from "./Button/ButtonItem";

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
    'button':ButtonItem,
}

const ItemData = ({data}) => {
    if (data.url && data.type !== 'image' && !data.url.match(/google|youtube/)) {
        data.url = 'https://drive.google.com/uc?id=' + data.url;
    }
    return (
        <>
            {React.createElement(Components[data.type], {
                    data,
                    key: data.id
                })}
        </>
    );
};

export default ItemData;