import {createSlice} from "@reduxjs/toolkit";
import {getLocation} from "../../../hooks/getLocation";

export const elementsSlice = createSlice({
    name: "elements",
    initialState: {
        itemsAll: {},
        items: [],
        cache: {},
        actionElement: {},
    },
    reducers: {
        setItemsAll: (state, {payload: {items}}) => {
            for (const item of items) {
                state.itemsAll[item.id] = item;
                for (const itemChild of item.items) {
                    state.itemsAll[itemChild.id] = itemChild;
                }
            }
            return state;
        },
        setElements: (state, {payload: {items, page}}) => {
            state.items = items;
            state.cache[page] = [...(state.cache[page]||[]), ...items];
            return state;
        },
        setActionElement: (state, {payload: {actionElement}}) => {
            state.actionElement = actionElement;
            return state;
        },
    }
});

export const { actions, reducer } = elementsSlice;