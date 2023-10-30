import {createSlice} from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        manager: null,
    },
    reducers: {
        setField: (state, {payload: {field, data}}) => {
            return {...state, [field]: data};
        }
    }
});

export const { actions, reducer } = commentsSlice;