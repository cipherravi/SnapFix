const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const { createClient } = require("redis");
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
  benchmark: !isProd,
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

// ------------- REDIS ---------------
const redisClient = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// ------------- UNIFIED CONNECTION LIFECYCLE ---------------
const connectDB = async () => {
  // 1. Mandatory Core: Postgres MUST connect or the whole thing crashes
  try {
    await sequelize.authenticate();
    console.log("Postgres connected ✅");
  } catch (err) {
    console.error(
      "❌ Critical Error: Postgres connection failed! Stopping server.",
    );
    console.error(err);
    process.exit(1); // Rigid stop
  }

  // Run concurrently, catch errors internally so they don't crash Postgres
  const mongoURI = isProd ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI;

  await Promise.all([
    mongoose
      .connect(mongoURI)
      .then(() => console.log("MongoDB connected ✅"))
      .catch((err) =>
        console.warn(
          "⚠️ MongoDB connection failed (Chat system down):",
          err.message,
        ),
      ),

    redisClient
      .connect()
      .then(() => console.log("Redis connected ✅"))
      .catch((err) =>
        console.warn("⚠️ Redis connection failed (Caching down):", err.message),
      ),
  ]);
};

module.exports = { connectDB, sequelize, redisClient };
