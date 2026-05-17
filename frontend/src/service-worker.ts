// src/service-worker.ts
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const API_KEY = import.meta.env.apiKey;
const AUTH_DOMAIN = import.meta.env.authDomain;
const PROJECT_ID = import.meta.env.projectId;
const STORAGE_BUCKET = import.meta.env.storageBucket;
const MESSAGING_SENDER_ID = import.meta.env.messagingSenderId;
const APP_ID = import.meta.env.appId;

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

// Precache all generated assets
precacheAndRoute(self.__WB_MANIFEST);

// 1. Initialize Firebase inside the worker
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
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
