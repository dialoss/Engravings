//@ts-nocheck
import React, {ReducerState, useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "hooks/redux";
import ItemList from "components/ItemList/ItemList";
import {actions, localReducer} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";
import {triggerEvent} from "../../../helpers/events";
import {createItemsTree, links} from "../helpers";
import DelayedVisibility from "../../../ui/DelayedVisibility/DelayedVisibility";
import store from "../../../store";
import {IRequest} from "../../ActionManager/ItemActions/actions";
import {ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";

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
        if (!fromCache) {
            globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : [], page}));
        }
        dispatch({method: 'SET', payload: createItemsTree([...itemsRef.current, ...newItems])});
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
        const response = await sendLocalRequest(url, request.item, request.method);
        console.log('RESPONSE', response)
        let item = response;
        // if (response) item = createItemsTree(response);
        console.log({...links})

        if (request.method === 'DELETE') {
            delete links[request.item.id];
        }
        else {
            if (request.method === "PATCH") {
                const childItems = links[item.id].items;
                links[item.id] = item;
                links[item.id].items = childItems;
            } else {
                links[item.id] = item;
                links[item.parent].items.push(links[item.id]);
            }

            globalDispatch(actions.setItemsAll({items: [item], page}));
        }
        console.log({...links})
        dispatch({method: "SET", payload: createItemsTree(Object.values(structuredClone(links)))});
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
    return (
        <DelayedVisibility timeout={300}>
            <ItemList loadMore={loadMore} items={items}></ItemList>
        </DelayedVisibility>
    );
};

export default ItemListContainer;