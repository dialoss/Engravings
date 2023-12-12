//@ts-nocheck
import {createSlice} from "@reduxjs/toolkit";
import store from "../../../store";
import {ItemElement} from "../../../ui/ObjectTransform/ObjectTransform";
import {IPage} from "../../../pages/AppRouter/store/reducers";
import {Intermediate} from "../../ActionManager/ItemActions/actions";
import {links} from "../helpers";

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

let found = {
    item: null,
    parent: null,
}
function findItem(id, parent) {
    if (found.item) return;
    for (const it of parent.items) {
        if (it.id === id) {
            found = {item: it, parent};
            return;
        }
        findItem(id, it);
    }
}

export function localReducer(state, action) {
    const item = action.payload[0];
    const method = action.method;
    if (method === "SET") return action.payload;

    found = {item:null,parent:null};
    switch (method) {
        case "PATCH":
        {
            findItem(item.id, {items: state});
            const items = found.parent.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    const childItems = items[i].items;
                    items[i] = {...item, items: childItems};
                    break;
                }
            }
            return structuredClone(state);
        }
        case "POST":
            findItem(item.parent, {items: state});
            found.item.items.push(item);
            found.item.items.sort((a, b) => a.order - b.order);
            return structuredClone(state);
        case 'DELETE':
            findItem(item.id, {items: state});
            const items = found.parent.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    delete items[i];
                    break;
                }
            }
            return structuredClone(state);
    }
}

export function pageEditable() {
    return store.getState().elements.editPage;
}