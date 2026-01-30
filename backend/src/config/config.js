const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

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
