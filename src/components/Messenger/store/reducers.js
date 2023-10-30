import {createSlice} from "@reduxjs/toolkit";


const emptyRoom = {picture: '', title: '', id: '', lastMessage: ''};

export const messengerSlice = createSlice({
    name: "messenger",
    initialState: {
        users: {},
        rooms: {},
        room: {},
        rooms_raw: {},
        messages: [],
        message: {
            text: '',
            upload: [],
        },
    },
    reducers: {
        setMessage: (state, {payload: data}) => {
            return {...state, message: {...state.message, ...data}};
        },
        setField: (state, {payload: {field, data}}) => {
            return {...state, [field]: data};
        },
        setRoom: (state, {payload: id}) => {
            if (id === -1) {
                return {...state, room: emptyRoom};
            }
            return {...state, room: state.rooms[id]};
        },
        setUsersMeta: (state, {payload: {data}}) => {
            let users = {...state.users};
            Object.keys(data).forEach(k => {
                if (!!users[k]) users[k] = {...users[k], ...data[k]};
            })
            return {...state, users: users};
        }
    }
});

export const { actions, reducer } = messengerSlice;