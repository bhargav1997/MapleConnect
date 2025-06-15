const Message = require("../models/Message");
const User = require("../models/User");

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
            error: "Recipient not found",
         });
      }

      // Handle attachments
      let attachments = [];
      if (req.files && req.files.length > 0) {
         attachments = req.files.map((file) => file.filename);
      }

      const message = await Message.create({
         sender: req.user.id,
         recipient,
         content,
         attachments,
      });

      // Populate sender and recipient
      const populatedMessage = await Message.findById(message._id)
         .populate("sender", "name profileImage")
         .populate("receiver", "name profileImage");

      res.status(201).json({
         success: true,
         data: populatedMessage,
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
            error: "User not found",
         });
      }

      // Get messages between current user and specified user
      const messages = await Message.find({
         $or: [
            { sender: req.user.id, receiver: userId },
            { sender: userId, receiver: req.user.id },
         ],
      })
         .populate("sender", "name profileImage")
         .populate("receiver", "name profileImage")
         .populate({
            path: "thoughtRef",
            model: "Thought",
            populate: [
               {
                  path: "user",
                  select: "name username profileImage",
               },
               {
                  path: "likes",
               },
               {
                  path: "comments",
                  populate: {
                     path: "user",
                     select: "name username profileImage",
                  },
               },
            ],
         })
         .sort("createdAt");

      // Filter out messages with deleted thoughts but keep the message with a placeholder
      const processedMessages = messages.map((message) => {
         if (message.type === "story" && !message.thoughtRef) {
            return {
               ...message.toObject(),
               thoughtRef: {
                  content: "This story is no longer available",
                  user: message.sender,
                  createdAt: message.createdAt,
                  likes: [],
                  comments: [],
               },
            };
         }
         return message;
      });

      console.log(
         "Messages with thoughts:",
         processedMessages.map((m) => ({
            type: m.type,
            content: m.content,
            thoughtRef: m.thoughtRef
               ? {
                    id: m.thoughtRef._id,
                    content: m.thoughtRef.content,
                    user: m.thoughtRef.user,
                 }
               : null,
         })),
      );

      // Mark messages as read
      const unreadMessages = messages.filter((message) => message.recipient._id.toString() === req.user.id && message.read === false);

      if (unreadMessages.length > 0) {
         await Message.updateMany(
            {
               recipient: req.user.id,
               sender: userId,
               read: false,
            },
            {
               read: true,
               readAt: Date.now(),
            },
         );
      }

      res.status(200).json({
         success: true,
         count: processedMessages.length,
         data: processedMessages,
      });
   } catch (err) {
      console.error("Error in getConversation:", err);
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
         $or: [{ sender: req.user.id }, { recipient: req.user.id }],
      })
         .populate("sender", "name username profileImage")
         .populate("receiver", "name username profileImage")
         .populate({
            path: "thoughtRef",
            populate: [
               {
                  path: "user",
                  select: "name username profileImage",
               },
               {
                  path: "likes",
               },
               {
                  path: "comments",
                  populate: {
                     path: "user",
                     select: "name username profileImage",
                  },
               },
            ],
         })
         .sort("-createdAt");

      // Extract unique user IDs
      const userIds = new Set();
      messages.forEach((message) => {
         if (message.sender._id.toString() !== req.user.id) {
            userIds.add(message.sender._id.toString());
         }
         if (message.recipient._id.toString() !== req.user.id) {
            userIds.add(message.recipient._id.toString());
         }
      });

      // Get the latest message for each conversation
      const conversations = [];

      for (const userId of userIds) {
         const latestMessage = await Message.findOne({
            $or: [
               { sender: req.user.id, receiver: userId },
               { sender: userId, receiver: req.user.id },
            ],
         })
            .populate("sender", "name username profileImage")
            .populate("receiver", "name username profileImage")
            .populate({
               path: "thoughtRef",
               populate: [
                  {
                     path: "user",
                     select: "name username profileImage",
                  },
                  {
                     path: "likes",
                  },
                  {
                     path: "comments",
                     populate: {
                        path: "user",
                        select: "name username profileImage",
                     },
                  },
               ],
            })
            .sort("-createdAt");

         // Count unread messages
         const unreadCount = await Message.countDocuments({
            sender: userId,
            recipient: req.user.id,
            read: false,
         });

         // Get user details
         const user = await User.findById(userId).select("name username profileImage");

         console.log("Latest message:", {
            messageId: latestMessage._id,
            type: latestMessage.type,
            thoughtRef: latestMessage.thoughtRef
               ? {
                    id: latestMessage.thoughtRef._id,
                    content: latestMessage.thoughtRef.content,
                    user: latestMessage.thoughtRef.user,
                 }
               : null,
         });

         conversations.push({
            user,
            latestMessage,
            unreadCount,
         });
      }

      // Sort conversations by latest message date
      conversations.sort((a, b) => {
         return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
      });

      res.status(200).json({
         success: true,
         count: conversations.length,
         data: conversations,
      });
   } catch (err) {
      console.error("Error in getConversations:", err);
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
            error: "Message not found",
         });
      }

      // Make sure user is the recipient
      if (message.recipient.toString() !== req.user.id) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to mark this message as read",
         });
      }

      // Update message
      message.read = true;
      message.readAt = Date.now();
      await message.save();

      res.status(200).json({
         success: true,
         data: message,
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
            error: "Message not found",
         });
      }

      // Make sure user is the sender or recipient
      if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to delete this message",
         });
      }

      // Store receiver ID before deleting
      const receiverId = message.sender.toString() === req.user.id ? message.recipient.toString() : message.sender.toString();

      await message.deleteOne();

      // Emit socket event for real-time deletion
      if (req.io) {
         req.io.to(`user_${receiverId}`).emit("message_deleted", {
            messageId: message._id,
            conversationId: receiverId,
         });
      }

      res.status(200).json({
         success: true,
         data: {
            messageId: message._id,
            receiverId: receiverId,
         },
      });
   } catch (err) {
      next(err);
   }
};
