import {createSlice} from "@reduxjs/toolkit";
import {getLocation} from "../../../hooks/getLocation";

export const elementsSlice = createSlice({
    name: "elements",
    initialState: {
        items: [],
        cache: {},
    },
    reducers: {
        setElements: (state, {payload: {items, page}}) => {
            state.items = items
            state.cache[page] = items;
            return state;
        },
    }
});

export const { actions, reducer } = elementsSlice;