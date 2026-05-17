// src/service-worker.ts
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

// Precache all generated assets
precacheAndRoute(self.__WB_MANIFEST);

// 1. Initialize Firebase inside the worker
const firebaseConfig = {
  apiKey: "AIzaSyCT9qAijl3dSG-LuyTpG834WTJcrXv7N3c",
  authDomain: "snapfix1812.firebaseapp.com",
  projectId: "snapfix1812",
  storageBucket: "snapfix1812.firebasestorage.app",
  messagingSenderId: "20565820203",
  appId: "1:20565820203:web:f666d6e5f819866c413b6e",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 2. Handle background messages
// onBackgroundMessage(messaging, (payload) => {
//   console.log("[sw.js] Background message received ", payload);
//   if (payload.notification) {
//     self.registration.showNotification(
//       payload.notification.title || "New Message",
//       {
//         body: payload.notification.body,
//         icon: "/icons/icon-192.png",
//       },
//     );
//   }
// });

onBackgroundMessage(messaging, async (payload) => {
  console.log("[sw.js] Background message received ", payload);

  if (payload.notification) {
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [200, 100, 200],
      data: {
        url: "/",
      },
      tag: "snapfix-notification",
      renotify: true,
    } as NotificationOptions & { vibrate?: number[] };

    await self.registration.showNotification(
      payload.notification.title || "New Message",
      notificationOptions,
    );
  }
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
