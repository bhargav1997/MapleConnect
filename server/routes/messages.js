const express = require("express");
const { sendMessage, getConversation, getConversations, markAsRead, deleteMessage } = require("../controllers/messages");
const { shareStory } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getUnreadCount } = require("../controllers/chats");

const router = express.Router();

// Protect all routes
router.use(protect);

// Get unread message count
router.get("/unread/count", protect, getUnreadCount);

// Share story in messages
router.route("/share-story").post(shareStory);

router.route("/").get(getConversations).post(upload.array("attachments", 5), sendMessage);

router.route("/:userId").get(getConversation);
router.route("/:id/read").put(markAsRead);
router.route("/:id").delete(deleteMessage);

module.exports = router;
