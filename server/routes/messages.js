const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage
} = require('../controllers/messages');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getConversations)
  .post(upload.array('attachments', 5), sendMessage);

router.route('/:userId').get(getConversation);
router.route('/:id/read').put(markAsRead);
router.route('/:id').delete(deleteMessage);

module.exports = router;
