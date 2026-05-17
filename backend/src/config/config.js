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
  development: {
    use_env_variable: "MIGRATION_DATABASE_URL",
    dialect: process.env.DB_DIALECT || "postgres",
  },

  production: {
    use_env_variable: "MIGRATION_DATABASE_URL",
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
};
