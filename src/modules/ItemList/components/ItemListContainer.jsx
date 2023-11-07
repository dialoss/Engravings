import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ItemList from "components/ItemList/ItemList";
import {actions, localReducer} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";
import store from "../../../store";
import {triggerEvent} from "../../../helpers/events";
import {createItemsTree} from "../helpers";

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(localReducer, []);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();

    function addItems(newItems, fromCache=false) {
        let items = structuredClone(newItems);
        !fromCache && (items = createItemsTree(items));
        !fromCache && globalDispatch(actions.setElements({items, page: getLocation().relativeURL}));
        globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : []}));
        dispatch({method: 'SET', payload: [...itemsRef.current, ...items]});
    }
    const [style, setStyle] = useState('hidden');
    useEffect(() => {
        let offset = 0;
        let page = getLocation().relativeURL;
        let cachedItems = store.getState().elements.cache[page];
        if (cachedItems) {
            addItems(cachedItems, true);
            offset = cachedItems.length;
        }
        fetchItems(offset, addItems);
        setTimeout(() => {
            setStyle('visible')
        }, 200);
    }, []);

    async function handleElements(event) {
        let request = event.detail;
        //console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        // console.log('RESPONSE', response)
        if (response.detail) {
            return;
        }
        dispatch({method: request.storeMethod, payload: createItemsTree(response)});
        if (response.length && !response[0].empty) {
            globalDispatch(actions.setItemsAll({items: response}));
        }

        if (request.method === 'DELETE') {
            let item = request.initialRequest.element.closest('.transform-item');
            item.setAttribute('data-top', 0);
            item.style.height = '0px';
            triggerEvent("container:init", {container: item.closest('.transform-container'), item});
        }
    }

    useAddEvent('itemlist:handle-changes', handleElements);

    return (
        <ItemList items={items} className={style}></ItemList>
    );
};

export default ItemListContainer;