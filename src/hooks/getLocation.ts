import store from "store";

export function getLocation() {
    return store.getState().location;
}