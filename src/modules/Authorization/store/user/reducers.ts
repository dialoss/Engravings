import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "users",
    initialState: {
        current: {
            isAdmin: false,
            authenticated: false,
            firebaseUser: null,
        },
        users: {},
    },
    reducers: {
        setUser: (state, {payload: user}) => {
            return {...state, current: {
                ...state.current,
                ...user
            }};
        },
        setUsers: (state, {payload: users}) => {
            return {...state, users};
        }
    }
});

export const { actions, reducer } = userSlice;