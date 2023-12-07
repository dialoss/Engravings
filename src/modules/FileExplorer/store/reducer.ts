import {createSlice} from "@reduxjs/toolkit";
import {AppStorage} from "../api/storage";

export const filemanagerSlice = createSlice({
    name: "filemanager",
    initialState: {
        storage: new AppStorage(),
    },
    reducers: {
        selectFiles: state => {

        }
    }
});

export const { actions, reducer } = filemanagerSlice;