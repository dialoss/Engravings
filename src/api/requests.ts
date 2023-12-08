import store from "store";
import Credentials from "../modules/Authorization/api/googleapi";
import {triggerEvent} from "../helpers/events";
import axios from "axios";

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

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



export async function sendRequest(url, data, method) {
    let response = null;
    const csrftoken = getCookie('csrftoken');
    let query = {
        url,
        method: method,
        credentials: "include",
        headers: {
            'X-CSRFToken': csrftoken,
            "Content-Type": 'application/json;charset=utf-8',
        },
        ...(method !== 'GET' ? {body: JSON.stringify(data)} : {})
    }
    try {
        await axios(query).then(d => response = d.data);
    } catch (e) {
        triggerEvent('alert:trigger', {
            body: 'failed to fetch',
            type: 'error',
        })
        return {"detail": "failed to fetch"};
    }
    return response;
}

export function sendLocalRequest(url, data={}, method='GET') {
    const location = store.getState().location;
    url = new URL(location.serverURL + url);
    return sendRequest(url.toString(), data, method);
}

export async function getGlobalTime() {
    let r = null
    await axios.get('https://worldtimeapi.org/api/timezone/Europe/London').then(data => r = data);
    return r;
}

export function sendEmail(email) {
    sendLocalRequest('/api/notification/email/', email, 'POST');
}