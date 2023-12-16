//@ts-nocheck
import React from 'react';
import ItemImage from "./Image/ItemImage";
import ItemFile from "./File/ItemFile";
import ItemTextfield from "./Textfield/ItemTextfield";
import ItemVideo from "./Video/ItemVideo";
import ItemBase from "./Base/BaseItem";
import PageFrom from "./PageFrom/PageFrom";
import SubscriptionItem from "./Subscription/SubscriptionItem";
import Section from "./Section/Section";
import Print from "./Print/Print";
import QuizContainer from "./Quiz/QuizContainer";

export const Components = {
    'base': ItemBase,
    'page_from': PageFrom,
    'image': ItemImage,
    'video': ItemVideo,
    'file': ItemFile,
    'print': Print,
    'quiz': QuizContainer,
    'section': Section,
    'textfield': ItemTextfield,
    'subscription': SubscriptionItem,
}

const ItemData = ({data}) => {
    if (data.url && data.type.match(/model|file/) && !data.url.match(/google|youtube|drive/)) {
        data.url = 'https://drive.google.com/uc?export=download&id=' + data.url;
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