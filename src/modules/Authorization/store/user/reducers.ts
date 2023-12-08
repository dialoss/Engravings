import {createSlice} from "@reduxjs/toolkit";

interface IUser {
    isAdmin: boolean,
    authenticated: boolean,
    firebase: object,
}

interface IUsers {
    current: IUser,
    users: IUser[],
}

export const userSlice = createSlice({
    name: "users",
    initialState: {
        current: {
            isAdmin: false,
            authenticated: false,
            firebaseUser: null,
        },
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