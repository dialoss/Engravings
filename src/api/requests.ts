//@ts-nocheck
import store from "store";
import Credentials from "../modules/Authorization/api/googleapi";
import {triggerEvent} from "../helpers/events";
import axios from "axios";
import {IUser} from "../components/Messenger/store/reducers";

// const SERVER_URL = 'https://matthew75.pythonanywhere.com';
const SERVER_URL = 'http://localhost:8000';

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

export function sendRequest(url, data, method) {
    const csrftoken = getCookie('csrftoken');
    let query = {
        url,
        method: method,
        credentials: "include",
        headers: {
            'X-CSRFToken': csrftoken,
            "Content-Type": 'application/json;charset=utf-8',
        },
        ...(method !== 'GET' ? {data} : {})
    }
    return axios(query).then(d => d.data).catch(r => {
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

export async function getGlobalTime() {
    let r = null
    await axios.get('https://worldtimeapi.org/api/timezone/Europe/London').then(data => r = data);
    return r;
}

interface IOrder {
    name: string,
}

interface IBuy {
}

export interface IEmail {
    recipient: string;
    type: 'order' | "buy";
    subject: string;
    data: {
        user: IUser;
        order?: IOrder,
        buy?: IBuy,
    }
}

export function sendEmail(email: IEmail) {
    sendLocalRequest('/api/notification/email/', email, 'POST');
}