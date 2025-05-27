const Message = require("../models/Message");
const User = require("../models/User");

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
         .populate("receiver", "name username profileImage");

      // Group messages by conversation
      const conversations = {};
      messages.forEach((message) => {
         const otherUserId = message.sender._id.toString() === userId ? message.receiver._id : message.sender._id;
         if (!conversations[otherUserId]) {
            conversations[otherUserId] = {
               user: message.sender._id.toString() === userId ? message.receiver : message.sender,
               lastMessage: message,
               unreadCount: 0,
            };
         }
         if (!message.readBy.includes(userId)) {
            conversations[otherUserId].unreadCount++;
         }
      });

      res.json({
         success: true,
         data: Object.values(conversations),
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
         .populate("receiver", "name username profileImage");

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

      const message = await Message.findById(messageId);
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

      // Add user to deletedFor array
      message.deletedFor.push(userId);
      await message.save();

      res.json({
         success: true,
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
