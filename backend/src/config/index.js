const getLogger = require("./logger-config");
const serverConfig = require("./server-config");
const connectDB = require("./database-config");
const supabase = require("./supabase-config");

module.exports = {
  serverConfig,
  getLogger,
  connectDB,
  supabase,
};
