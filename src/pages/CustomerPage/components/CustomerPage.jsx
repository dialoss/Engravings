import React from 'react';
import Container from "ui/Container/Container";
import Timeline from "components/Timeline/Timeline";
import {prepareColors, Stages} from "./stages";
import {useAddEvent} from "hooks/useAddEvent";
import {triggerEvent} from "helpers/events";
import store from 'store';
import ItemList from "../../../components/ItemList/ItemList";

const CustomerPage = () => {

    function handleAction(event) {
        triggerEvent("router:navigate", {path:"/customer/"});
        switch (event.detail.action) {
            case 'BUY':
                break;
            case 'ORDER':
                break;
        }
    }
    useAddEvent("customer:action", handleAction);

    let items =  store.getState().elements.items.slice(0, 5);
    console.log(items)
    return (
        <section className={'my-orders'}>
            <ItemList items={items}></ItemList>
            <Timeline stages={prepareColors(Stages)}></Timeline>
        </section>
    );
};

export default CustomerPage;