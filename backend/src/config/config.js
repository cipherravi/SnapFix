const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "postgres",
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
};
