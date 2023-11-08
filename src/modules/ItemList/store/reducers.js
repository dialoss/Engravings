import {createSlice} from "@reduxjs/toolkit";

export const elementsSlice = createSlice({
    name: "elements",
    initialState: {
        itemsAll: {},
        items: [],
        cache: {},
        actionElement: {},
        prevElement: {},
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
        setField: (state, {payload: {field, element}}) => {
            state[field] = element;
            return state;
        },
    }
});

export const { actions, reducer } = elementsSlice;

export function localReducer(state, action) {
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