import {useSelector} from "react-redux";

export function useCredentials() {
    return useSelector(store => store.credentials);
}