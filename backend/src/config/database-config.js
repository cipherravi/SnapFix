const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

// ------------- POSTGRES ---------------

const isProd = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",

  benchmark: true, // ✅ gives query execution time

  logging: (query, timing) => {
    // timing is in ms (because benchmark: true)

    if (timing > 1) {
      console.log("🐢 Slow Query:");
      console.log("⏱ Time:", timing + "ms");
      console.log("📄 SQL:", query);
      console.log("----------------------------------");
    }
  },

  dialectOptions: isProd
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
});

// ------------- MONGO ---------------

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI
        : process.env.MONGO_LOCAL_URI;
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.warn(
      "⚠️ MongoDB connection failed (chat system down):",
      err.message,
    );
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
