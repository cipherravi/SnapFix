const getLogger = require("./logger-config");
const serverConfig = require("./server-config");
const { connectDB, sequelize } = require("./database-config");
const supabase = require("./supabase-config");
const ai = require("./ai-config");
const mailConfig = require("./mail-config");

module.exports = {
  serverConfig,
  getLogger,
  connectDB,
  sequelize,
  supabase,
  ai,
  mailConfig,
};
