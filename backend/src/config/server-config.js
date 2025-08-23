const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
}

module.exports = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  EXPIRES_IN: process.env.EXPIRES_IN,
};
