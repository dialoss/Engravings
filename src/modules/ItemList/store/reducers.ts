//@ts-nocheck
import {createSlice} from "@reduxjs/toolkit";
import store from "../../../store";
import {ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";
import {IPage} from "../../../pages/AppRouter/store/reducers";
import {Intermediate} from "../../ActionManager/ItemActions/actions";

interface IElements {
    itemsAll: {
        [key: number]: ItemElement,
    };
    cache: object;
    pageItems: object;
    focused: object;
    editPage: boolean;
    intermediate: Intermediate[];
}

interface Payload {
    payload: {
        items: ItemElement[];
        page: string;
    }
}

export const elementsSlice = createSlice({
    name: "elements",
    initialState: {
        itemsAll: {},
        cache: {},
        pageItems: {},
        focused: {},
        intermediate: [],
        editPage: false,
    } as IElements,
    reducers: {
        setItemsAll: (state: IElements, {payload: {items, page}} : Payload) => {
            if (!state.cache[page]) state.cache[page] = {};
            for (const item of items) {
                state.itemsAll[item.id] = item;
                state.cache[page][item.id] = item;
            }
            state.pageItems = state.cache[page];
            return state;
        },
        setField: (state, {payload: {field, data}}) => {
            state[field] = data;
            return state;
        },
    }
});

export const { actions, reducer } = elementsSlice;

export function localReducer(state, action) {
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
            newState.splice(item.order, 0, item);
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