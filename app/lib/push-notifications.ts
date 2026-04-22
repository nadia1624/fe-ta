import { notificationApi } from './api';

const VAPID_PUBLIC_KEY = 'BGJLoLkRSK2eg8ALsLILa16UkERU4JOlHuoOPLzgvq5YIC5uJXHX4-uBI2Rp7AKnEIenwO9m7qq6hnk11D8I7yE';

/**
 * Convert VAPID key to Uint8Array
 */
export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * Check if the browser supports notifications and service workers
 */
export const isPushSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
};

let isProcessing = false;

/**
 * Register Service Worker and Subscribe to Push
 */
export const setupPushNotifications = async () => {
    if (!isPushSupported()) {
        console.warn('Push notifications are not supported in this browser.');
        return;
    }

    if (isProcessing) return;
    isProcessing = true;

    try {
        // 1. Register Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;

        // 2. Request Notification Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied.');
            return;
        }

        // 3. Subscribe to Push Manager
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // 4. Send subscription to Backend
        await notificationApi.subscribe(subscription);
        console.log('Successfully subscribed to push notifications.');
    } catch (error) {
        console.error('Error during push notification setup:', error);
    } finally {
        isProcessing = false;
    }
};

/**
 * Unsubscribe from Push (typically on logout)
 */
export const unsubscribeFromPush = async () => {
    if (!isPushSupported()) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            // Notify backend before unsubscribing locally
            await notificationApi.unsubscribe(subscription.endpoint);
            
            // Unsubscribe locally
            await subscription.unsubscribe();
            console.log('Successfully unsubscribed from push notifications.');
        }
    } catch (error) {
        console.error('Error during push notification unsubscribe:', error);
    }
};
