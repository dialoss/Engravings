import {sendLocalRequest} from "api/requests";
import {triggerEvent} from "../../../helpers/events";

export async function fetchItems(offset, callback, limit) {
    let step = 20;
    let cur = offset;
    while (true) {
        if (cur >= limit) break;
        if (cur / step === 2) step = 30;
        let page = {
            limit: step,
            offset: cur,
        };
        const urlParams = new URLSearchParams(page).toString();
        const response = await sendLocalRequest(`/api/items/?${urlParams}`, {method:"GET"})
        console.log('FETCHED ITEMS' , response)
        if (!response.results) return;
        callback({newItems: response.results, count: response.count});
        cur += step;
        if (cur >= response.count) break;
    }
}