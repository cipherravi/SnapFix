const exprss = require("express");
const router = exprss.Router();
const { ConversationController } = require("../../controllers");
const { verifyUser } = require("../../middlewares");
const {
  getAllUserConversations,
  getConversationIdByJobId,
  getConversationMessages,
} = ConversationController;

router.get("/", verifyUser, getAllUserConversations);
router.get("/:jobId", verifyUser, getConversationIdByJobId);
router.get("/:conversationId/messages", verifyUser, getConversationMessages);

module.exports = router;
