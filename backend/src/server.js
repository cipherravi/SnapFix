require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { serverConfig } = require("./config");
const { connectDB, sequelize } = require("./config");
const { PORT } = serverConfig;
const { allowedOrigins } = require("./utils/constants/allowedOrigins");
const apiRoutes = require("./routes");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const { setupSocket } = require("./socket");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  }),
);

const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 50000,
});
app.use(limiter);

const io = setupSocket(server, allowedOrigins);

app.use("/api", apiRoutes);

connectDB()
  .then(async () => {
    await sequelize.authenticate();
    console.log("Postgres connected ✅");
  })
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server started running at PORT ::", PORT);
    });
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
