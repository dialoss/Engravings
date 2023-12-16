//@ts-nocheck
import store from "store";
import {triggerEvent} from "../helpers/events";
import axios from "axios";

// const SERVER_URL = 'https://matthew75.pythonanywhere.com';
const SERVER_URL = 'http://localhost:8000';


export default class Credentials {
    static ACCESS_TOKEN = '';
    static REFRESHED_TIME = 0;
    static async fetch() {
        return await sendLocalRequest('/api/google/credentials/').then(response => {
            Credentials.ACCESS_TOKEN = response.token;
            if (response.refreshed) {
                Credentials.REFRESHED_TIME = new Date().getTime();
            }
        });
    }
    static async getToken() {
        if (new Date().getTime() - Credentials.REFRESHED_TIME > 3400) await Credentials.fetch();
        return Credentials.ACCESS_TOKEN;
    }
}

export async function fetchRequest(url) {
    if (!url.includes('firebase')) {
        const query = new URL(url);
        const FILE_ID = query.searchParams.get('id');
        url = `https://www.googleapis.com/drive/v2/files/${FILE_ID}?alt=media`;
    }

    return await axios({
        method: "GET",
        url,
        headers: {
            "Authorization": "Bearer " + await Credentials.getToken(),
        },
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

export function sendRequest(url, data, method) {
    const csrftoken = getCookie('csrftoken');
    let query = {
        method: method,
        credentials: "include",
        headers: {
            'X-CSRFToken': csrftoken,
            "Content-Type": 'application/json;charset=utf-8',
        },
        ...(method !== 'GET' ? {body:JSON.stringify(data)} : {})
    }
    return fetch(url, query).then(d => d.json()).then(d => d).catch(r => {
        triggerEvent('alert:trigger', {
            body: 'failed to fetch',
            type: 'error',
        })
    });
}

export function sendLocalRequest(endpoint, data={}, method='GET') {
    const location = store.getState().location;
    let url = new URL(SERVER_URL + endpoint);
    if (url.search) url.search += '&';
    url.search += new URLSearchParams({path: location.relativeURL.slice(1, -1)}).toString();
    return sendRequest(url.toString(), data, method);
}

export function getGlobalTime() {
    return axios.get('https://worldtimeapi.org/api/timezone/Europe/London').then(r => r.data);
}
