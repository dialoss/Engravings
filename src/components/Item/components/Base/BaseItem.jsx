import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActiveThemes} from "ui/Themes";
import "./BaseItem.scss";
import PageFrom from "../PageFrom/PageFrom";
import SubscriptionItem from "../Subscription/SubscriptionItem";

const ItemBase = ({data}) => {
    return (
        <div className={"item__base"}>
            <PageFrom data={data}></PageFrom>
            <SubscriptionItem data={data}></SubscriptionItem>
        </div>
    );
};

export default ItemBase;