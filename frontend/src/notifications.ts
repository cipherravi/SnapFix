import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type InitNotificationsParams = {
  authToken: string;
};

export const initNotifications = async ({
  authToken,
}: InitNotificationsParams) => {
  try {
    // 1. Check if Service Worker is actually supported/active
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push messaging is not supported");
      return;
    }

    const msgInstance = await messaging();
    if (!msgInstance) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Permission denied");
    }

    // Ensure SW is active
    const registration = await navigator.serviceWorker.ready;

    // Extra check: Ensure the worker is active before requesting token
    if (!registration.active) {
      console.warn("Service worker not active yet, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const token = await getToken(msgInstance, {
      vapidKey:
        "BDJPBSaqyHxXxzFxZ7O0Qdl_Le2QA65j79i3wVM_HVdXkhbkgqE91HKfkXPBMqGJIN7FYcLB-7O40ZFounAX3IU",
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("🚀 FCM Token:", token);
      // Sync with backend
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/users/me/push-subscriptions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token }),
        },
      );

      const data = await res.json();
      console.log(data);
    }

    // Foreground listener
    onMessage(msgInstance, (payload) => {
      console.log("Foreground message received:", payload);
      // Logic to show a toast or a browser notification
      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title || "New Alert", {
          body: payload.notification?.body,
          icon: "/icons/icon-192.png",
        });
      }
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        "Push Service Error: Handshake aborted. Check VAPID or User Gesture.",
      );
    } else {
      console.error("Notification Error:", error);
    }
  }
};
