import React, {useEffect, useReducer, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ItemList from "components/ItemList/ItemList";
import {actions} from "../store/reducers";
import {fetchItems} from "../api/fetchItems";
import {useAddEvent} from "hooks/useAddEvent";
import {sendLocalRequest} from "api/requests";
import {getLocation} from "../../../hooks/getLocation";

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
                console.log(1111)
                newState.splice(item.display_pos, 0, item);
                return newState;
            }
        case 'DELETE':
        {
            if (item.empty) return [...state].filter(el => el.id !== item.id);
            let newState = [...state];
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === item.id) newState[i] = item;
            }
            return newState;
        }
    }
}

function createItemsTree(items) {
    if (!items.length || items[0].empty) return [];
    console.log('BEFORE TREE', items)

    let tree = {};
    let links = {};
    let childItems = [];
    items.forEach(c => {
        childItems = [...childItems, ...c.items];
        tree[c.id] = {...c, items: []};
        links[c.id] = tree[c.id];
    })
    childItems = childItems.sort((a, b) => {
        if (+a.parent < +b.parent) return -1;
        if (+a.parent > +b.parent) return 1;
        return 0;
    })
    console.log('BEFORE TREE CHILD', childItems)
    childItems.forEach(c => {
        let p = links[c.parent];
        p.items.push({...c, items: []});
        links[c.id] = p.items[p.items.length - 1];
    });

    let sorted = (Object.values(tree)).sort((a, b) => {
        if (a.display_pos < b.display_pos) return -1;
        if (a.display_pos > b.display_pos) return 1;
        return 0;
    });
    console.log('AFTER TREE', sorted);
    return sorted;
}

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(reducer, []);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();

    function addItems(newItems, createTree=true) {
        let afterTree = structuredClone(newItems);
        createTree && (afterTree = createItemsTree(afterTree));
        let items = [...itemsRef.current, ...afterTree];
        globalDispatch(actions.setElements({items: afterTree, page: getLocation().pageID}));
        globalDispatch(actions.setItemsAll({items: createTree ? newItems : []}));
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
        console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log('RESPONSE', response)
        globalDispatch(actions.setItemsAll({items: response}));
        dispatch({method: request.storeMethod, payload: createItemsTree(response)});
    }

    useAddEvent('itemlist:handle-changes', handleElements);

    return (
        <ItemList items={items}></ItemList>
    );
};

export default ItemListContainer;