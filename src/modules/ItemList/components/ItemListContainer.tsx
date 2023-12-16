//@ts-nocheck
import React, {ReducerState, useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "hooks/redux";
import ItemList from "components/ItemList/ItemList";
import {actions, localReducer} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {sendLocalRequest} from "api/requests";
import {createItemsTree} from "../helpers";
import DelayedVisibility from "../../../ui/DelayedVisibility/DelayedVisibility";
import {IRequest} from "../../ActionManager/ItemActions/actions";
import {ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";
import store from "../../../store";

interface Itemlist {
    request: (url:string, request: IRequest) => void;
    set(f: (url:string, request: IRequest) => void);
}

export class ItemlistManager implements Itemlist{
    request = null;
    set(f: (url:string, request: IRequest) => void) {
        this.request = f;
    }
}

export const manager = new ItemlistManager();

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(localReducer, [] as ReducerState<ItemElement[]>);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useAppDispatch();
    const [totalItems, setTotalItems] = useState(0);
    let page = useAppSelector(state => state.location.relativeURL);
    async function addItems({newItems, count}, fromCache=false) {
        if (count) setTotalItems(count);
        let cachedItems: ItemElement[] = store.getState().elements.cache[page];
        if (cachedItems) cachedItems = Object.values(cachedItems);
        else cachedItems = [];
        if (!fromCache) {
            globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : [], page}));
        }
        dispatch({method: 'SET', payload: createItemsTree([...cachedItems, ...newItems])});
    }

    const limit = useRef<number>();
    limit.current = 60;

    useLayoutEffect(() => {
        let offset = 0;
        // let cachedItems: ItemElement[] = store.getState().elements.cache[page];
        // if (cachedItems) {
        //     addItems({newItems:cachedItems, count:null}, true);
        //     offset = cachedItems.length;
        // } else {
        //     window.scrollTo(0, 0);
        // }
        fetchItems(offset, limit.current, addItems);
    }, []);

    async function handleElements(url:string, request: IRequest) {
        console.log('REQUEST', request)
        if (request.instant && request.method === 'PATCH' && request.endpoint !== 'pages') {
            dispatch({method: request.method, payload: [request.item]});
            return;
        }
        const response = await sendLocalRequest(url, request.item, request.method);
        if (request.endpoint === 'pages') return;
        console.log('RESPONSE', response)
        dispatch({method: request.method, payload: [response || request.item]});
        if (request.method !== 'DELETE')
            globalDispatch(actions.setItemsAll({items: [response], page}));
    }

    useEffect(() => {
        manager.set(handleElements);
    }, []);

    function loadMore() {
        if (totalItems < items.length) {
            limit.current = items.length + 60;
            fetchItems(items.length, limit.current, addItems);
        }
    }
    console.log(items)
    return (
        <DelayedVisibility timeout={300}>
            <ItemList loadMore={loadMore} items={items}></ItemList>
        </DelayedVisibility>
    );
};

export default ItemListContainer;