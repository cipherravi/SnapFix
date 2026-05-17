const admin = require("firebase-admin");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = require("./server-config");

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim(),
  }),
});

module.exports = admin.messaging(app);

// ERROR if not send successfully ->> messaging/registration-token-not-registered
