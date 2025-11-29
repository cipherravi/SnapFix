const Conversation = require("../models/conversation");
const Message = require("../models/message");
const { User } = require("../models");

class ConversationRepository {
  async getConversationsbyUserId(userId, active = true) {
    try {
      const conversations = await Conversation.find({
        participants: userId,
        active: active, // optional: only active conversations
      }).sort({ "lastMessage.createdAt": -1, updatedAt: -1 }); // //  sort by actual last message time

      // Step 1: Collect all other participant IDs
      const otherUserIds = conversations
        .map((conv) => conv.participants.find((id) => id !== +userId))
        .filter(Boolean);

      // Step 2: Fetch all users in a single query
      const users = await User.findAll({
        where: { id: otherUserIds },
        attributes: ["id", "name", "profilePicUrl"],
      });

      // Step 3: Index users by ID for fast lookup
      const userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });

      // Step 4: Enrich conversations
      const enriched = await Promise.all(
        conversations.map(async (conv) => {
          const otherUserId = conv.participants.find((id) => id !== +userId);
          const otherUser = userMap[otherUserId];
          const lastRead = conv.lastReadMap.get(String(userId)) || new Date(0);

          // Count unread messages
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            senderId: { $ne: userId },
            createdAt: { $gt: lastRead || new Date(0) }, // default: count all if never read
          });

          return {
            id: conv._id,
            jobId: conv.jobId,
            active: conv.active,
            updatedAt: conv.updatedAt,
            createdAt: conv.createdAt,
            participant: otherUser
              ? {
                  id: otherUser.id,
                  name: otherUser.name,
                  profilePic: otherUser.profilePicUrl,
                }
              : null,
            lastMessage: conv.lastMessage ?? null,
            unreadCount,
          };
        })
      );

      return enriched;
    } catch (error) {
      throw error;
    }
  }
  async getConversationId(userId, jobId, active = true) {
    try {
      const conversation = await Conversation.findOne({ jobId, active });
      if (!conversation || !conversation.participants.includes(userId)) {
        return null;
      }

      return {
        id: conversation._id,
      };
    } catch (error) {
      throw error;
    }
  }

  async getMessagesbyConversationId(conversationId, before = new Date()) {
    try {
      const messages = await Message.find({
        conversationId: conversationId,
        createdAt: { $lt: new Date(before) },
      })
        .sort({ createdAt: -1 })
        .limit(20);
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async getUnreadCountByUserId(userId) {
    try {
      const conversations = await Conversation.find({
        participants: userId,
        active: true,
      });

      const unreadCounts = await Promise.all(
        conversations.map(async (conv) => {
          const lastRead = conv.lastReadMap.get(String(userId)) || new Date(0);

          return Message.countDocuments({
            conversationId: conv._id,
            senderId: { $ne: userId },
            createdAt: { $gt: lastRead },
          });
        })
      );

      return unreadCounts.reduce((sum, count) => sum + count, 0);
    } catch (error) {
      throw error;
    }
  }
  getConversationById(id) {
    try {
      const conversation = Conversation.findById(id);
      return conversation;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = ConversationRepository;
