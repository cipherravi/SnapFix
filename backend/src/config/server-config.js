const path = require("path");
require("dotenv").config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../../.env.production"
      : "../../.env.development",
  ),
});

module.exports = {
  PORT: process.env.PORT || 2944,
  SECRET_KEY: process.env.SECRET_KEY,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  EXPIRES_IN: process.env.EXPIRES_IN,
  supabaseServiceKey: process.env.supabaseServiceKey,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GMAIL_ID: process.env.GMAIL_ID,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  LEDGER_SECRET_KEY: process.env.LEDGER_SECRET_KEY,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  REDIS_URL: process.env.REDIS_URL,
};
