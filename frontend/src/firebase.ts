import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

const API_KEY = import.meta.env.apiKey;
const AUTH_DOMAIN = import.meta.env.authDomain;
const PROJECT_ID = import.meta.env.projectId;
const STORAGE_BUCKET = import.meta.env.storageBucket;
const MESSAGING_SENDER_ID = import.meta.env.messagingSenderId;
const APP_ID = import.meta.env.appId;
const MEASUREMENT_ID = import.meta.env.measurementId;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Messaging only if the browser supports it (SSR/Private window check)
export const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};
