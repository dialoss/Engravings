const CACHE_NAME = 'v1';
const urls = ['index.html', 'offline.html'];

const addResourcesToCache = async (resources) => {
};

self.addEventListener("install", (event) => {
});

self.addEventListener('notificationclick', function (e) {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: "window" }).then((clientsArr) => {
            const hadWindowToFocus = clientsArr.some((windowClient) =>
                windowClient.url === e.notification.data.url
                    ? (windowClient.focus(), true)
                    : false,
            );
            if (!hadWindowToFocus)
                clients
                    .openWindow(e.notification.data.url)
                    .then((windowClient) => (windowClient ? windowClient.focus() : null));
        }),
    );
});