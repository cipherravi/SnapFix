const express = require("express");
const app = express();
const cors = require("cors");
const { serverConfig } = require("./config");
const { connectDB } = require("./config");
const Message = require("./models/message");
const Conversation = require("./models/conversation");
const { PORT } = serverConfig;
const { allowedOrigins } = require("./utils/constants/allowedOrigins");
const apiRoutes = require("./routes");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const supabase = require("./config/supabase-config");
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

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
  })
);

const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  max: 500,
});
app.use(limiter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

// Socket.IO handler
io.on("connection", (socket) => {
  console.log("🔌 New client connected", socket.id);
  // set user online

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
    //set user offline
  });

  socket.on("joinRoom", (conversationId) => {
    if (!conversationId) return;
    socket.join(conversationId);
    console.log(`🟢 ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("markAsRead", async (conversationId, userId) => {
    if (!userId) return;

    // ✅ Update lastReadMap
    try {
      await Conversation.updateOne(
        { _id: conversationId },
        {
          $set: { [`lastReadMap.${String(userId)}`]: new Date() },
        }
      );
      console.log(`📬 Updated lastReadMap for user ${userId}`);
    } catch (error) {
      console.error("❌ Failed to update lastReadMap:", error);
    }
  });

  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, text, localId }) => {
      if (!conversationId || !text) return;

      console.log(
        `📩 Message in room ${conversationId} from ${socket.id}:`,
        text
      );

      socket.to(conversationId).emit("receiveMessage", {
        text,
        senderId,
        createdAt: new Date().toISOString(),
        localId,
      });
      socket.emit("messageSent", { success: true });

      try {
        await Message.create({ conversationId, senderId, text });
        socket.emit("messageSaved", { success: true });
        await Conversation.updateOne(
          { _id: conversationId },
          {
            $set: {
              lastMessage: {
                text: text,
                sender: senderId,
                createdAt: new Date(),
              },
            },
          }
        );
        console.log("💾 Message saved to DB");
      } catch (error) {
        console.error("❌ Failed to save message:", error);
      }
    }
  );

  socket.on("leaveRoom", async (conversationId) => {
    socket.leave(conversationId);
    console.log(`🔚 ${socket.id} left room: ${conversationId}`);
  });
});

app.use("/api", apiRoutes);

// async function getImageUrl(fileName) {
//   const { data } = supabase.storage.from("SnapFix").getPublicUrl(fileName);

//   return data.publicUrl;
// }
//
// async function getSignedUrl(fileName) {
//   const { data, error } = await supabase.storage
//     .from("SnapFix-private")
//     .createSignedUrl(fileName, 10); // expires in 60 sec

//   if (error) {
//     console.error("Signed URL error:", error);
//     return null;
//   }

//   return data.signedUrl;
// }

// // Run inside an async function
// (async () => {
//   const url = await getImageUrl("IMG_1220.JPG");
//   console.log("Public URL:", url);

//   const signedUrl = await getSignedUrl("IMG_1220.JPG");
//   console.log("Signed URL:", signedUrl);
// })();

connectDB()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server started running at PORT ::", PORT);
    });
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
