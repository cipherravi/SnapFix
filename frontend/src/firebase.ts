import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT9qAijl3dSG-LuyTpG834WTJcrXv7N3c",
  authDomain: "snapfix1812.firebaseapp.com",
  projectId: "snapfix1812",
  storageBucket: "snapfix1812.firebasestorage.app",
  messagingSenderId: "20565820203",
  appId: "1:20565820203:web:f666d6e5f819866c413b6e",
  measurementId: "G-ZMY8M5WRRN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Messaging only if the browser supports it (SSR/Private window check)
export const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};
