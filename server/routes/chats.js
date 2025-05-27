const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getConversations, getMessages, deleteMessage, deleteConversation } = require("../controllers/chats");

// Get all conversations for the current user
router.get("/conversations", protect, getConversations);

// Get messages between two users
router.get("/messages/:userId", protect, getMessages);

// Delete a specific message
router.delete("/messages/:messageId", protect, deleteMessage);

// Delete entire conversation with a user
router.delete("/conversations/:userId", protect, deleteConversation);

module.exports = router;
