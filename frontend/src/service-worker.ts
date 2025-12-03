// src/service-worker.ts
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

// Precache all generated assets
precacheAndRoute(self.__WB_MANIFEST);

// Force new SW to activate immediately
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  self.clients.claim();
  // delete old caches if any
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
  );
});
