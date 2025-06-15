const Message = require("../models/Message");
const User = require("../models/User");
const Thought = require("../models/Thought");
const mongoose = require("mongoose");

// Share a story with another user via messages
exports.shareStory = async (req, res) => {
   try {
      const { thoughtId, userId } = req.body;
      const senderId = req.user._id;

      // Verify the thought exists first
      const thought = await Thought.findById(thoughtId).populate("user", "name username profileImage");
      if (!thought) {
         return res.status(404).json({
            success: false,
            message: "Story not found",
         });
      }

      // Create a new message with the shared story
      const message = await Message.create({
         sender: senderId,
         receiver: userId,
         content: "Shared a story",
         type: "story",
         isSharedStory: true,
         thoughtRef: thoughtId,
      });

      // Populate all necessary fields for socket emission
      const populatedMessage = await Message.findById(message._id)
         .populate("sender", "name username profileImage")
         .populate("receiver", "name username profileImage")
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
         });

      console.log("Shared story message:", {
         messageId: populatedMessage._id,
         type: populatedMessage.type,
         thoughtRef: populatedMessage.thoughtRef
            ? {
                 id: populatedMessage.thoughtRef._id,
                 content: populatedMessage.thoughtRef.content,
                 user: populatedMessage.thoughtRef.user,
              }
            : null,
      });

      // Emit socket event for real-time updates
      if (req.io) {
         // Emit to both sender and recipient
         req.io.to(`user_${senderId}`).emit("new_message", populatedMessage);
         req.io.to(`user_${userId}`).emit("new_message", populatedMessage);
      }

      res.status(200).json({
         success: true,
         message: "Story shared successfully",
         data: populatedMessage,
      });
   } catch (error) {
      console.error("Error sharing story:", error);
      res.status(500).json({
         success: false,
         message: "Failed to share story",
         error: error.message,
      });
   }
};
