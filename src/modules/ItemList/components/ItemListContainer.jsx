import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ItemList from "components/ItemList/ItemList";
import {actions} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";
import store from "../../../store";
import {triggerEvent} from "../../../helpers/events";

function reducer(state, action) {
    let item = action.payload[0];
    switch (action.method) {
        case "SET":
            return action.payload;
        case "PATCH":
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === item.id) {
                    let newState = [...state];
                    newState[i] = item;
                    return newState;
                }
            }
            return state;
        case "POST":
            {
                let newState = [...state];
                newState.splice(item.display_pos, 0, item);
                return newState;
            }
        case 'DELETE':
        {
            return [...state].filter(el => el.id !== item.id);
        }
    }
}

function createItemsTree(items) {
    if (!items.length || items[0].empty) return items;
    console.log('BEFORE TREE', items)

    let tree = {};
    let links = {};
    let childItems = [];
    items.forEach(c => {
        childItems = [...childItems, ...c.items];
        tree[c.id] = {...c, items: []};
        links[c.id] = tree[c.id];
    })
    childItems = childItems.sort((a, b) => +a.parent - +b.parent)
    console.log('BEFORE TREE CHILD', childItems)
    childItems.forEach(c => {
        let p = links[c.parent];
        p.items.push({...c, items: []});
        links[c.id] = p.items[p.items.length - 1];
    });

    let sorted = (Object.values(tree)).sort((a, b) => a.display_pos - b.display_pos);
    console.log('AFTER TREE', sorted);
    return sorted;
}

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(reducer, []);
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
        console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log('RESPONSE', response)
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