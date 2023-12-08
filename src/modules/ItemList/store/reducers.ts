import {createSlice} from "@reduxjs/toolkit";
import store from "../../../store";

interface IElements {
    itemsAll: object;
    cache: object;
    pageItems: object;
    actionElement: object;
    editPage: boolean;
}

export const elementsSlice = createSlice({
    name: "elements",
    initialState: {
        itemsAll: {},
        cache: {},
        pageItems: {},
        actionElement: {},
        editPage: false,
    } as IElements,
    reducers: {
        setItemsAll: (state: IElements, {payload: {items, page}}) => {
            for (const item of items) {
                state.itemsAll[item.id] = item;
                for (const itemChild of item.items) {
                    state.itemsAll[itemChild.id] = itemChild;
                }
            }
            state.cache[page] = [...(state.cache[page]||[]), ...items];
            state.pageItems = state.cache[page];
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

export function pageEditable() {
    return store.getState().elements.editPage;
}