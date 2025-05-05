const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipient, content } = req.body;
    
    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found'
      });
    }
    
    // Handle attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => file.filename);
    }
    
    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content,
      attachments
    });
    
    // Populate sender and recipient
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage')
      .populate('recipient', 'name profileImage');
    
    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get conversation with a user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    })
      .populate('sender', 'name profileImage')
      .populate('recipient', 'name profileImage')
      .sort('createdAt');
    
    // Mark messages as read
    const unreadMessages = messages.filter(
      message =>
        message.recipient._id.toString() === req.user.id &&
        message.read === false
    );
    
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          recipient: req.user.id,
          sender: userId,
          read: false
        },
        {
          read: true,
          readAt: Date.now()
        }
      );
    }
    
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all conversations
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    // Get all users the current user has messaged or received messages from
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }]
    }).sort('-createdAt');
    
    // Extract unique user IDs
    const userIds = new Set();
    messages.forEach(message => {
      if (message.sender.toString() !== req.user.id) {
        userIds.add(message.sender.toString());
      }
      if (message.recipient.toString() !== req.user.id) {
        userIds.add(message.recipient.toString());
      }
    });
    
    // Get the latest message for each conversation
    const conversations = [];
    
    for (const userId of userIds) {
      const latestMessage = await Message.findOne({
        $or: [
          { sender: req.user.id, recipient: userId },
          { sender: userId, recipient: req.user.id }
        ]
      })
        .populate('sender', 'name profileImage')
        .populate('recipient', 'name profileImage')
        .sort('-createdAt');
      
      // Count unread messages
      const unreadCount = await Message.countDocuments({
        sender: userId,
        recipient: req.user.id,
        read: false
      });
      
      // Get user details
      const user = await User.findById(userId).select('name profileImage');
      
      conversations.push({
        user,
        latestMessage,
        unreadCount
      });
    }
    
    // Sort conversations by latest message date
    conversations.sort((a, b) => {
      return (
        new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)
      );
    });
    
    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    // Make sure user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to mark this message as read'
      });
    }
    
    // Update message
    message.read = true;
    message.readAt = Date.now();
    await message.save();
    
    res.status(200).json({
      success: true,
      data: message
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    // Make sure user is the sender or recipient
    if (
      message.sender.toString() !== req.user.id &&
      message.recipient.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this message'
      });
    }
    
    await message.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
