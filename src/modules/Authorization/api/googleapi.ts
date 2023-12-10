//@ts-nocheck
import {sendLocalRequest} from "api/requests";

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