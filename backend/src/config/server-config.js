const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

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
};
