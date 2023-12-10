//@ts-nocheck
import {createSlice} from "@reduxjs/toolkit";

interface IUser {
    isAdmin: boolean,
    authenticated: boolean,
    firebaseUser: object,
    id: number;
}

interface IUsers {
    current: IUser,
    users: IUser[],
}

export const userSlice = createSlice({
    name: "users",
    initialState: {
        current: {
            id: 0,
            isAdmin: false,
            authenticated: false,
            firebaseUser: null,
        } as IUser,
        users: {},
    } as IUsers,
    reducers: {
        setUser: (state: IUsers, {payload: user}) => {
            state.current = {...state.current, ...user};
        },
        setUsers: (state: IUsers, {payload: users}) => {
            state.users = users;
        }
    }
});

export const { actions, reducer } = userSlice;