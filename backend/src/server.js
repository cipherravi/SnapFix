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
const http = require("http");
const server = http.createServer(app);
const { setupSocket } = require("./socket");

// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST"],
//   },
// });

// Serve static files
// app.use(express.static(path.join(__dirname, "../public")));

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

const io = setupSocket(server, allowedOrigins);

// -----------------------
// Socket.IO handler
// // -----------------------
// io.on("connection", (socket) => {
//   console.log("🔌 New client connected:", socket.id);

//   // ---------------------
//   // Chat Events
//   // ---------------------
//   socket.on("joinRoom", (conversationId) => {
//     if (!conversationId) return;
//     socket.join(conversationId);
//     console.log(`🟢 ${socket.id} joined room: ${conversationId}`);
//   });

//   socket.on("leaveRoom", (conversationId) => {
//     socket.leave(conversationId);
//     console.log(`🔚 ${socket.id} left room: ${conversationId}`);
//   });

//   socket.on(
//     "sendMessage",
//     async ({ conversationId, senderId, text, localId }) => {
//       if (!conversationId || !text) return;

//       // Broadcast to room
//       socket.to(conversationId).emit("receiveMessage", {
//         text,
//         senderId,
//         createdAt: new Date().toISOString(),
//         localId,
//       });

//       // Save message to DB
//       try {
//         await Message.create({ conversationId, senderId, text });
//         await Conversation.updateOne(
//           { _id: conversationId },
//           {
//             $set: {
//               lastMessage: { text, sender: senderId, createdAt: new Date() },
//             },
//           }
//         );
//         socket.emit("messageSaved", { success: true });
//       } catch (err) {
//         console.error("❌ Failed to save message:", err);
//       }
//     }
//   );

//   socket.on("markAsRead", async (conversationId, userId) => {
//     if (!userId) return;

//     // ✅ Update lastReadMap
//     try {
//       await Conversation.updateOne(
//         { _id: conversationId },
//         {
//           $set: { [`lastReadMap.${String(userId)}`]: new Date() },
//         }
//       );
//       console.log(`📬 Updated lastReadMap for user ${userId}`);
//     } catch (error) {
//       console.error("❌ Failed to update lastReadMap:", error);
//     }
//   });

//   // ---------------------
//   // Voice Call Events
//   // ---------------------
//   socket.on("send-offer", ({ offer, toConversationId }) => {
//     socket.to(toConversationId).emit("call-offer", { offer, from: socket.id });
//   });

//   socket.on("call-answer", ({ answer, to }) => {
//     io.to(to).emit("call-answered", { answer });
//   });

//   socket.on("reject-call", ({ to }) => {
//     io.to(to).emit("call-rejected");
//   });

//   socket.on("ice-candidate", ({ candidate, to }) => {
//     io.to(to).emit("ice-candidate", candidate);
//   });

//   socket.on("end-call", ({ to }) => {
//     io.to(to).emit("call-ended");
//   });

//   // ---------------------
//   // Disconnect
//   // ---------------------
//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//   });
// });

app.use("/api", apiRoutes);

connectDB()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server started running at PORT ::", PORT);
    });
  })
  .catch((err) => {
    console.log("ERROR", err);
  });
