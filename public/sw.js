/*
 * Service Worker for Web Push Notifications
 */

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Immediately take control of all clients
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            // If not JSON, treat as plain text
            data = {
                body: event.data.text()
            };
        }
    }

    const title = data.title || 'Notifikasi Baru';
    const message = data.body || 'Anda mendapatkan pesan baru.';
    const icon = data.icon || '/logo-padang.svg';
    const badge = data.badge || '/favicon.ico';

    const notificationOptions = {
        body: message,
        icon: icon,
        badge: badge,
        data: data.data || {}, // Custom data passed from backend
        tag: data.tag || 'generic-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(title, notificationOptions)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window open and focus it
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
