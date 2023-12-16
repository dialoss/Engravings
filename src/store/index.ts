//@ts-nocheck
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {reducer as locationReducer} from "pages/AppRouter/store/reducers";
import {reducer as elementsReducer} from "modules/ItemList/store/reducers";

const reducers = combineReducers({
    location: locationReducer,
    elements: elementsReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: reducers,
        devTools: true,
    });
}

export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export default setupStore();