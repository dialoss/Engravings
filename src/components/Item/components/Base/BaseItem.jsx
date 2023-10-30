import React, {useContext, useEffect, useRef, useState} from 'react';
import InfoBlock from "ui/InfoBlock/InfoBlock";
import {Link} from "react-router-dom";
import TransformContainer from "ui/ObjectTransform/components/TransformContainer/TransformContainer";
import TransformItem from "ui/ObjectTransform/components/TransformItem/TransformItem";
import {ActiveThemes} from "ui/Themes";
import "./BaseItem.scss";
import {triggerEvent} from "../../../../helpers/events";
import {fileToItem} from "../../../../modules/FileExplorer/FileExplorer";
import ItemLink from "../Link/ItemLink";
import Item from "../../Item";
import SubscriptionItem from "../Subscription/SubscriptionItem";

const ItemBase = ({data, ...props}) => {
    const theme = useContext(ActiveThemes);
    const style = theme.listStyle;

    let mediaItems = 0;
    let itemsRow = 1;
    data.items.forEach(item => {
        if (['video', 'image', 'model'].includes(item.type)) mediaItems += 1;
    })
    if (mediaItems >= 3) itemsRow = 3;
    else if (mediaItems >= 2) itemsRow = 2;

    return (
        <div className={"item__base"} onDrop={async e =>{
            e.preventDefault();
            let files = [];
            for (const file of [...e.dataTransfer.files]) {
                let data = await window.filemanager.settings.oninitupload(null, {folder: null, file});
                files = [...files, fileToItem({...data, type: data.filetype, filename: data.name})];
            }
            for (const file of (JSON.parse(e.dataTransfer.getData('files') || "[]"))) {
                files.push(file);
            }
            if (!files) return;
            triggerEvent("action:init", e);
            triggerEvent("action:callback", files);
        }} onDragOver={(e) => e.preventDefault()}>
            <ItemLink data={data}></ItemLink>
            <SubscriptionItem data={data}></SubscriptionItem>
        </div>
    );
};

export default ItemBase;