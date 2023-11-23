import React, {useEffect, useLayoutEffect, useReducer, useRef, useState} from 'react';
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
import NavButton from "../../../ui/Navbar/Button/NavButton";
import DelayedVisibility from "../../../ui/DelayedVisibility/DelayedVisibility";

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(localReducer, []);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    let page = useSelector(state => state.location.relativeURL);

    async function addItems({newItems, count}, fromCache=false) {
        let items = newItems;
        setTotalItems(count);
        items = createItemsTree(items);
        if (!fromCache) {
            globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : [], page}));
        }
        dispatch({method: 'SET', payload: [...itemsRef.current, ...items]});
    }

    const limit = useRef();
    limit.current = getLocation().parentSlug ? 80 : 60;

    useLayoutEffect(() => {
        changeTab({detail:0});
        let offset = 0;
        let cachedItems = store.getState().elements.cache[page];
        if (cachedItems) {
            console.log(cachedItems, page)
            addItems({newItems:cachedItems}, true);
            offset = cachedItems.length;
        } else {
            window.scrollTo(0, 0);
        }
        fetchItems(offset, addItems, limit.current);
    }, []);

    useLayoutEffect(() => {
        setTotalItems(items.length);
    }, [items.length]);

    async function handleElements(event) {
        let request = event.detail;
        console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log('RESPONSE', response)
        if (request.data.type === 'page') {
            triggerEvent('sidebar:update');
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

    function changeTab(event) {
        const t = event.detail;
        setFilter(() => (item) => (item.tab === t) || item.style === 'tabs');
        window.currentTab = t;
    }
    const [filter, setFilter] = useState(() => (item) => true);
    useAddEvent('itemlist:tab', changeTab);
    return (
        <DelayedVisibility timeout={300}>
            <ItemList loadMore={totalItems === items.length ? null : () => {
                limit.current = items.length + 60;
                fetchItems(items.length, addItems, limit.current);
            }} items={items.filter(filter)}></ItemList>
        </DelayedVisibility>
    );
};

export default ItemListContainer;