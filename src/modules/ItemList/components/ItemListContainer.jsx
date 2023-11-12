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
import NavButton from "../../../ui/Navbar/Button/NavButton";

const ItemListContainer = () => {
    const [items, dispatch] = useReducer(localReducer, []);
    const itemsRef = useRef();
    itemsRef.current = items;
    const globalDispatch = useDispatch();
    const totalItems = useRef();

    async function addItems({newItems, count}, fromCache=false) {
        let items = newItems;
        if (!fromCache) {
            totalItems.current = count;
            items = createItemsTree(items);
            globalDispatch(actions.setItemsAll({items: !fromCache ? newItems : []}));
        }
        dispatch({method: 'SET', payload: [...itemsRef.current, ...items]});
    }
    const [style, setStyle] = useState('hidden');
    const [filter, setFilter] = useState(() => (item) => true);

    const limit = useRef();
    limit.current = getLocation().parentSlug ? 80 : 60;

    useEffect(() => {
        changeTab({detail:{tab:0}});
        let offset = 0;
        let page = getLocation().relativeURL;
        let cachedItems = store.getState().elements.cache[page];
        if (cachedItems) {
            addItems({newItems:cachedItems}, true);
            offset = cachedItems.length;
        } else {
            window.scrollTo(0, 0);
        }
        fetchItems(offset, addItems, limit.current);
        setTimeout(() => {
            setStyle('visible')
        }, 300);
    }, []);

    async function handleElements(event) {
        let request = event.detail;
        console.log('REQUEST', request)
        const response = await sendLocalRequest(request.url, request.data, request.method);
        console.log('RESPONSE', response)
        if (request.method === 'DELETE') {
            let item = request.initialRequest.element.closest('.transform-item');
            item.setAttribute('data-top', 0);
            item.style.height = '0px';
            triggerEvent("container:init", {container: item.closest('.transform-container'), item});
            try{
                dispatch({method: request.storeMethod, payload: createItemsTree(response.items)});
            } catch (e) {
                console.log('ОШИБКА' , e)
            }
            return
        }

        const newItems = response.items;
        if (!newItems) {
            return;
        }
        dispatch({method: request.storeMethod, payload: createItemsTree(newItems)});
        if (newItems.length && !newItems[0].empty) {
            globalDispatch(actions.setItemsAll({items: newItems}));
        }
    }
    useAddEvent('itemlist:handle-changes', handleElements);

    function changeTab(event) {
        const t = event.detail.tab;
        setFilter(() => (item) => (item.group_order === 'tab_' + t) || item.group_order === 'tabs');
        window.currentTab = 'tab_' + t;
    }

    useAddEvent('itemlist:tab', changeTab);

    return (
        <>
            <ItemList loadMore={totalItems.current === items.length ? null : () => {
                limit.current = items.length + 60;
                fetchItems(items.length, addItems, limit.current);
            }} items={items.filter(filter)} className={style}></ItemList>
        </>
    );
};

export default ItemListContainer;