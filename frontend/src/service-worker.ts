// src/service-worker.ts
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
const VITE_PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const VITE_STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET;
const VITE_MESSAGING_SENDER_ID = import.meta.env.VITE_MESSAGING_SENDER_ID;
const VITE_APP_ID = import.meta.env.VITE_APP_ID;

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

// Precache all generated assets
precacheAndRoute(self.__WB_MANIFEST);

// 1. Initialize Firebase inside the worker
const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, async (payload) => {
  console.log("[sw.js] Background message received ", payload);

  // Check for 'data' instead of 'notification'
  if (payload.data) {
    const notificationOptions = {
      body: payload.data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [200, 100, 200],
      data: {
        url: payload.data.url || "/",
      },
      tag: "snapfix-notification",
      renotify: true,
    } as NotificationOptions & { vibrate?: number[] };

    await self.registration.showNotification(
      payload.data.title || "New Message",
      notificationOptions,
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Extract the target URL from the notification data fallback to '/' if empty
  const targetUrl = event.notification.data?.url || "/";

  // Resolve the URL to an absolute URL based on the service worker's origin
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // 1. Check if a tab with this exact URL is already open
        for (const client of windowClients) {
          if (client.url === absoluteUrl && "focus" in client) {
            return client.focus();
          }
        }

        // 2. If no matching tab is found, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(absoluteUrl);
        }
      }),
  );
});

// Force new SW to activate immediately
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  self.clients.claim();
  // delete old caches if any
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
  );
});
