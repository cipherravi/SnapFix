const jwt = require("jsonwebtoken");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { SECRET_KEY } = require("../config/server-config");
const { Server } = require("socket.io");

let ioInstance = null;

function setupSocket(server, allowedOrigins) {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      allowedHeaders: ["cookie"],
      credentials: true,
    },
    // transports: ["websocket"],
  });

  ioInstance = io; // store instance so we can export it later

  // Middleware: Authenticate using cookies
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) return next(new Error("Token missing"));

      const user = jwt.verify(token, SECRET_KEY);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid Token"));
    }
  });

  // Socket events
  io.on("connection", async (socket) => {
    const userId = socket.user.id;

    console.log(`🔌 User ${userId} connected (socket: ${socket.id})`);

    // personal room
    socket.join(`user:${userId}`);

    // auto join conversations
    const conversations = await Conversation.find({
      participants: userId,
      active: true,
    });
    conversations.forEach((c) => socket.join(`conv:${c._id}`));

    console.log(
      `📡 User ${userId} joined ${conversations.length} conversations`
    );

    // --------------------------
    // Chat Events
    // --------------------------
    socket.on("sendMessage", async ({ conversationId, text, localId }) => {
      const senderId = socket.user.id;

      socket.to(`conv:${conversationId}`).emit("receiveMessage", {
        text,
        senderId,
        conversationId,
        createdAt: new Date(),
        localId,
      });

      await Message.create({ conversationId, senderId, text });

      await Conversation.updateOne(
        { _id: conversationId },
        {
          $set: {
            lastMessage: { text, sender: senderId, createdAt: new Date() },
          },
        }
      );
      socket.emit("messageSaved", { success: true });
    });

    socket.on("markAsRead", async (conversationId) => {
      const userId = socket.user.id;
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { [`lastReadMap.${userId}`]: new Date() } }
      );
      console.log(`📬 Updated lastReadMap for user ${userId}`);
    });

    // --------------------------
    // Voice Call (WebRTC)
    // --------------------------
    socket.on("send-offer", ({ offer, conversationId }) => {
      // send to everyone in conv EXCEPT caller
      socket.to(`conv:${conversationId}`).emit("call-offer", {
        offer,
        from: socket.user.id, // userId of caller
      });
    });

    socket.on("call-answer", ({ answer, conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("call-answered", { answer });
    });

    socket.on("reject-call", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("call-rejected");
    });

    socket.on("ice-candidate", ({ candidate, conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("ice-candidate", { candidate });
    });

    socket.on("end-call", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("call-ended");
    });

    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  return io;
}

// Export the io instance so other files can use it
function getIO() {
  return ioInstance;
}

module.exports = { setupSocket, getIO };
