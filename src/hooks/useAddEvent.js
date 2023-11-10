import {useEffect} from "react";

export function useAddEvent(name, func) {
    useEffect(() => {
        window.addEventListener(name, func);
        return () => {
            window.removeEventListener(name, func);
        }
    }, []);
}