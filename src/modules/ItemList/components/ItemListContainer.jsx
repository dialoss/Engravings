import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ItemList from "components/ItemList/ItemList";
import {actions} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";

function reducer(state, action) {
    switch (action.method) {
        case "SET":
            return action.payload;
        case "PATCH":
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.payload.id) {
                    let newState = [...state];
                    newState[i] = action.payload;
                    return newState;
                }
            }
            return state;
        case "POST":
            {
                let newState = [...state];
                let item = action.payload[0];
                newState.splice(item.display_pos, 0, item);
                return newState;
            }
        case 'DELETE':
        {
            if (action.payload.empty) return [...state].filter(el => el.id !== action.payload.id);
            let newState = [...state];
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === action.payload.id) newState[i] = action.payload;
            }
            return newState;
        }
    }
}

function createItemsTree(items) {
    console.log(items)
    let tree = {};
    let links = {};
    let childItems = [];
    items.forEach(c => {
        childItems = [...childItems, ...c.items];
        tree[c.id] = {...c, items: []};
        links[c.id] = tree[c.id];
    })
    childItems.forEach(c => {
        let p = links[c.parent];
        p.items.push(c);
        links[c.id] = p.items[p.items.length - 1];
    });
    return Object.values(tree);
}

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(reducer, []);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();

    function addItems(newItems, createTree=true) {
        createTree && (newItems = createItemsTree(newItems));
        let items = [...itemsRef.current, ...newItems];
        globalDispatch(actions.setElements({items, page: getLocation().pageID}));
        dispatch({method: 'SET', payload: items});
    }
    const cache = useSelector(state => state.elements.cache);

    useEffect(() => {
        let offset = 0;
        let page = getLocation().pageID;
        let cachedItems = cache[page];
        if (cachedItems) {
            addItems(cachedItems, false);
            offset = cachedItems.length;
        }
        fetchItems(offset, addItems);
    }, []);

    async function handleElements(event) {
        let request = event.detail;
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log(response)
        dispatch({method: request.storeMethod, payload: createItemsTree(response)});
    }

    useAddEvent('itemlist:handle-changes', handleElements);

    return (
        <ItemList items={items}></ItemList>
    );
};

export default ItemListContainer;