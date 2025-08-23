const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.warn(
      "⚠️ MongoDB connection failed (chat system down):",
      err.message
    );
  }
};

module.exports = connectDB;
