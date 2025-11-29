const exprss = require("express");
const router = exprss.Router();
const { ConversationController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const {
  getAllUserConversations,
  getConversationIdByJobId,
  getConversationMessages,
  getUnreadCountOfUser,
  getConversationById,
} = ConversationController;

router.get("/", verifyUser, getAllUserConversations);
router.get("/unread-count", verifyUser, getUnreadCountOfUser);
router.get("/by-job", verifyUser, getConversationIdByJobId);
router.get("/:id", verifyUser, getConversationById);
router.get("/:conversationId/messages", verifyUser, getConversationMessages);

module.exports = router;
