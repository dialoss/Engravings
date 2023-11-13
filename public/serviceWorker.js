const CACHE_NAME = 'v1';
const urls = ['index.html', 'offline.html'];

const addResourcesToCache = async (resources) => {
};

self.addEventListener("install", (event) => {
});

self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    e.waitUntil(
        clients
            .matchAll({
                type: "window",
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === "/" && "focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(e.notification.data.url);
            }),
    );
});