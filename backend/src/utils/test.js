const { Client } = require("pg");
const c = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
c.connect()
  .then(() => console.log("CONNECTED"))
  .catch((e) => console.error(e));
