import React, {useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ItemList from "components/ItemList/ItemList";
import {actions, localReducer} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";
import {triggerEvent} from "../../../helpers/events";
import {createItemsTree} from "../helpers";
import DelayedVisibility from "../../../ui/DelayedVisibility/DelayedVisibility";
import store from "../../../store";

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(localReducer, [] as ReducerState<object[]>);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    let page = useSelector(state => state.location.relativeURL);
    async function addItems({newItems, count}, fromCache=false) {
        let items = newItems;
        if (count) setTotalItems(count);
        items = createItemsTree(items);
        // if (!fromCache) {
        //     globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : [], page}));
        // }
        dispatch({method: 'SET', payload: [...itemsRef.current, ...items]});
    }

    const limit = useRef<number>();
    limit.current = 60;

    useLayoutEffect(() => {
        let offset = 0;
        // let cachedItems = store.getState().elements.cache[page];
        // if (cachedItems) {
        //     addItems({newItems:cachedItems}, true);
        //     offset = cachedItems.length;
        // } else {
        //     window.scrollTo(0, 0);
        // }
        fetchItems(offset, limit.current, addItems);
    }, []);

    async function handleElements(event) {
        let request = event.detail;
        console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log('RESPONSE', response)
        if (request.data.type === 'page') {
            triggerEvent('sidebar:update');
        }
        if (response.detail) {
            triggerEvent('alert:trigger', {
                body: response.detail,
                type: 'error',
            })
        }
        const newItems = response.items;
        if (!newItems) {
            return;
        }
        dispatch({method: request.storeMethod, payload: createItemsTree(newItems)});
        if (newItems.length && !newItems[0].empty) {
            globalDispatch(actions.setItemsAll({items: newItems, page}));
        }
    }
    useAddEvent('itemlist:request', handleElements);

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