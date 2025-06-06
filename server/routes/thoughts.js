const express = require("express");
const { protect } = require("../middleware/auth");
const Thought = require("../models/Thought");

const router = express.Router();

// Get all thoughts (with optional topic filter)
router.get("/", protect, async (req, res) => {
   try {
      const { topic } = req.query;
      const query = {
         expiresAt: { $gt: new Date() },
      };

      if (topic) {
         query.topics = topic;
      }

      const thoughts = await Thought.find(query).sort({ createdAt: -1 }).populate("user", "name profileImage username");

      res.json({
         success: true,
         data: thoughts,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to fetch thoughts",
      });
   }
});

// Get trending topics
router.get("/trending", protect, async (req, res) => {
   try {
      const trendingTopics = await Thought.getTrendingTopics();
      res.json({
         success: true,
         data: trendingTopics,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to fetch trending topics",
      });
   }
});

// Create a new thought
router.post("/", protect, async (req, res) => {
   try {
      const { content, type, topics } = req.body;

      const thought = await Thought.create({
         content,
         type,
         topics,
         user: req.user._id,
      });

      await thought.populate("user", "name profileImage username");

      res.status(201).json({
         success: true,
         data: thought,
      });
   } catch (error) {
      res.status(400).json({
         success: false,
         error: "Failed to create thought",
      });
   }
});

// Like/unlike a thought
router.post("/:thoughtId/like", protect, async (req, res) => {
   try {
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
         return res.status(404).json({
            success: false,
            error: "Thought not found",
         });
      }

      const likeIndex = thought.likes.indexOf(req.user._id);

      if (likeIndex === -1) {
         thought.likes.push(req.user._id);
      } else {
         thought.likes.splice(likeIndex, 1);
      }

      await thought.save();

      res.json({
         success: true,
         data: thought,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to update like",
      });
   }
});

// Add a comment
router.post("/:thoughtId/comments", protect, async (req, res) => {
   try {
      const { content } = req.body;
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
         return res.status(404).json({
            success: false,
            error: "Thought not found",
         });
      }

      thought.comments.push({
         user: req.user._id,
         content,
      });

      await thought.save();
      await thought.populate("comments.user", "name profileImage username");

      res.json({
         success: true,
         data: thought,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to add comment",
      });
   }
});

// Save to highlights
router.post("/:thoughtId/highlight", protect, async (req, res) => {
   try {
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
         return res.status(404).json({
            success: false,
            error: "Thought not found",
         });
      }

      if (thought.user.toString() !== req.user._id.toString()) {
         return res.status(403).json({
            success: false,
            error: "Not authorized to save this thought to highlights",
         });
      }

      await thought.saveToHighlights();

      res.json({
         success: true,
         data: thought,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to save to highlights",
      });
   }
});

// Get user's highlights
router.get("/highlights", protect, async (req, res) => {
   try {
      const highlights = await Thought.find({
         user: req.user._id,
         savedToHighlights: true,
      }).sort({ createdAt: -1 });

      res.json({
         success: true,
         data: highlights,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Failed to fetch highlights",
      });
   }
});

// Delete a thought
router.delete("/:thoughtId", protect, async (req, res) => {
   try {
      console.log("Delete thought request:", {
         thoughtId: req.params.thoughtId,
         userId: req.user._id,
      });

      const thought = await Thought.findById(req.params.thoughtId).populate("user", "name email profileImage");

      if (!thought) {
         console.log("Thought not found:", req.params.thoughtId);
         return res.status(404).json({
            success: false,
            error: "Thought not found",
         });
      }

      console.log("Found thought:", {
         id: thought._id,
         content: thought.content.substring(0, 50) + "...",
         authorId: thought.user._id,
         authorName: thought.user.name,
      });

      // Convert IDs to strings for comparison
      const thoughtUserId = thought.user._id.toString();
      const requestUserId = req.user._id.toString();

      // Debug log for server-side comparison
      console.log("Delete authorization check:", {
         thoughtUserId,
         requestUserId,
         isMatch: thoughtUserId === requestUserId,
         thoughtUser: thought.user,
         requestUser: req.user,
      });

      // Check if the user owns the thought
      if (thoughtUserId !== requestUserId) {
         console.log("Authorization failed - user IDs don't match");
         return res.status(403).json({
            success: false,
            error: "Not authorized to delete this thought",
         });
      }

      await thought.deleteOne();
      console.log("Thought deleted successfully");

      res.json({
         success: true,
         message: "Thought deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting thought:", error);
      res.status(500).json({
         success: false,
         error: "Failed to delete thought",
      });
   }
});

module.exports = router;
