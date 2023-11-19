

self.addEventListener('notificationclick', function (e) {
    console.log('WORKER')
    console.log(e)
    e.notification.close();
    clients.openWindow(e.notification.data.url);
    e.waitUntil(
        clients
            .matchAll({
                type: "window",
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === "/" && "focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(e.data.url);
            }),
    );
});