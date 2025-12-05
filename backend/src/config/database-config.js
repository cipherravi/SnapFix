const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI
        : process.env.MONGO_LOCAL_URI;
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.warn(
      "⚠️ MongoDB connection failed (chat system down):",
      err.message
    );
  }
};

module.exports = connectDB;
