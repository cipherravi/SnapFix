const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../../.env.production"
      : "../../.env.development",
  ),
});

// ------------- POSTGRES ---------------

const isProd = process.env.NODE_ENV === "production";

const devLogging = (query, timing) => {
  if (timing > 50) {
    console.log("🐢 Slow Query:");

    console.log("⏱ Time:", timing + "ms");

    console.log("📄 SQL:", query);

    console.log("----------------------------------");
  }
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",

  benchmark: !isProd, // ✅ gives query execution time

  logging: !isProd ? devLogging : false,

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
