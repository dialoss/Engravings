import {sendLocalRequest} from "../../../api/requests";
import {triggerEvent} from "../../../helpers/events";

export function sendCloudMessage(data) {
    sendLocalRequest('/api/notification/message/', data, 'POST');
}

function createNotification(info) {
    navigator.serviceWorker.ready.then(function (registration) {
        registration.showNotification(info.title, {
            body: info.body,
            badge: "https://drive.google.com/uc?id=1RUXipSltKDNIJ9LtmccZXYy2yc-afZjc",
            icon: "https://drive.google.com/uc?id=1RUXipSltKDNIJ9LtmccZXYy2yc-afZjc",
            vibrate: [300, 100, 500, 100, 200],
            data: info.data,
        });
    });
}


export function notifyUser(info) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
        createNotification(info);
    } else {
        triggerEvent('user-prompt', {title:'Разрешите уведомления, чтобы всегда быть в курсе новостей.', button:'ok'})
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                createNotification(info);
            }
        });
    }
}
