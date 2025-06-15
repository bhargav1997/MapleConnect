const Message = require("../models/Message");
const User = require("../models/User");

// Get unread message count for the current user
exports.getUnreadCount = async (req, res) => {
   try {
      const userId = req.user.id;

      const unreadCount = await Message.countDocuments({
         receiver: userId,
         readBy: { $ne: userId },
      });

      res.json({
         success: true,
         count: unreadCount,
      });
   } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({
         success: false,
         message: "Failed to get unread message count",
      });
   }
};

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
   try {
      const userId = req.user.id;

      // Get all messages where user is either sender or receiver
      const messages = await Message.find({
         $or: [{ sender: userId }, { receiver: userId }],
      })
         .sort({ createdAt: -1 })
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
         });

      // Group messages by conversation and calculate unread counts
      const conversationsMap = new Map();

      messages.forEach((message) => {
         const isUserSender = message.sender._id.toString() === userId;
         const otherUser = isUserSender ? message.receiver : message.sender;
         const otherUserId = otherUser._id.toString();

         if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, {
               user: otherUser,
               lastMessage: message,
               messages: [],
               unreadCount: 0,
            });
         }

         const conversation = conversationsMap.get(otherUserId);
         conversation.messages.push(message);

         // Update unread count if message is received and not read
         if (!isUserSender && !message.readBy.includes(userId)) {
            conversation.unreadCount++;
         }
      });

      // Convert map to array and format response
      const conversations = Array.from(conversationsMap.values()).map(({ messages, ...conv }) => conv);

      res.json({
         success: true,
         data: conversations,
      });
   } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({
         success: false,
         message: "Failed to get conversations",
      });
   }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
   try {
      const userId = req.user.id;
      const otherUserId = req.params.userId;

      const messages = await Message.find({
         $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId },
         ],
      })
         .sort({ createdAt: 1 })
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
         });

      // Mark messages as read
      const unreadMessages = messages.filter((message) => message.receiver._id.toString() === userId && !message.readBy.includes(userId));

      if (unreadMessages.length > 0) {
         await Message.updateMany(
            {
               _id: { $in: unreadMessages.map((msg) => msg._id) },
            },
            {
               $addToSet: { readBy: userId },
            },
         );
      }

      res.json({
         success: true,
         data: messages,
      });
   } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({
         success: false,
         message: "Failed to get messages",
      });
   }
};

// Delete a specific message
exports.deleteMessage = async (req, res) => {
   try {
      const userId = req.user.id;
      const messageId = req.params.messageId;
      console.log("--->", userId, messageId);

      const message = await Message.findById(messageId);
      console.log("message", message);
      if (!message) {
         return res.status(404).json({
            success: false,
            message: "Message not found",
         });
      }

      // Check if user is either sender or receiver
      if (message.sender.toString() !== userId && message.receiver.toString() !== userId) {
         return res.status(403).json({
            success: false,
            message: "Not authorized to delete this message",
         });
      }

      // Actually delete the message
      await Message.deleteOne({ _id: messageId });

      // Emit socket event for real-time updates to both users
      if (req.io) {
         const receiverId = message.sender.toString() === userId ? message.receiver.toString() : message.sender.toString();
         const eventData = {
            messageId: message._id,
            conversationId: receiverId,
         };

         // Emit to both sender and receiver to ensure both sides update
         req.io.to(`user_${userId}`).emit("message_deleted", eventData);
         req.io.to(`user_${receiverId}`).emit("message_deleted", eventData);
      }

      res.json({
         success: true,
         data: {
            messageId: message._id,
            receiverId: message.sender.toString() === userId ? message.receiver.toString() : message.sender.toString(),
         },
         message: "Message deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({
         success: false,
         message: "Failed to delete message",
      });
   }
};

// Delete entire conversation with a user
exports.deleteConversation = async (req, res) => {
   try {
      const userId = req.user.id;
      const otherUserId = req.params.userId;

      // Mark all messages in the conversation as deleted for the current user
      await Message.updateMany(
         {
            $or: [
               { sender: userId, receiver: otherUserId },
               { sender: otherUserId, receiver: userId },
            ],
         },
         {
            $addToSet: { deletedFor: userId },
         },
      );

      res.json({
         success: true,
         message: "Conversation deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({
         success: false,
         message: "Failed to delete conversation",
      });
   }
};
