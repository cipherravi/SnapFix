const getLogger = require("./logger-config");
const serverConfig = require("./server-config");
const connectDB = require("./database-config");
const supabase = require("./supabase-config");
const ai = require("./ai-config");
const mailConfig = require("./mail-config");

module.exports = {
  serverConfig,
  getLogger,
  connectDB,
  supabase,
  ai,
  mailConfig,
};
