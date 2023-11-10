import store from "store";
import Credentials from "../modules/Authorization/api/googleapi";

export async function fetchRequest(url) {
    if (!url.includes('firebase')) {
        const query = new URL(url);
        const FILE_ID = query.searchParams.get('id');
            url = `https://www.googleapis.com/drive/v2/files/${FILE_ID}?alt=media`;
    }
    return await fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + await Credentials.getToken(),
        }
    });
}

export async function sendRequest(url, data, method) {
    let response = null;
    let query = {
        method: method,
        credentials: "include",
        headers: {
            "Content-Type": 'application/json;charset=utf-8',
        },
        ...(method !== 'GET' ? {body: JSON.stringify(data)} : {})
    }
    try {
        await fetch(url, query).then(res => res.json()).then(data => response = data);
    } catch (e) {
        console.log(e);
        return {"detail": "failed to fetch"};
    }
    return response;
}

export function sendLocalRequest(url, data={}, method='GET') {
    const location = store.getState().location;
    url = new URL(location.baseURL + url);
    url.search += '&' + new URLSearchParams({slug: location.pageSlug || location.pageID,
            path: location.relativeURL.slice(1, -1)}).toString();
    return sendRequest(url.toString(), data, method);
}

export async function getGlobalTime() {
    let r = null
    await fetch('https://worldtimeapi.org/api/timezone/Europe/London').
        then(res => res.json()).then(data => r = data);
    return r;
}

export function sendEmail(email) {
    sendLocalRequest('/api/notification/email/', {
        recipient: 'matthewwimsten@gmail.com',
        ...email,
    }, 'POST');
}