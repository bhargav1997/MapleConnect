const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// @desc    Get all users with details
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
   try {
      const users = await User.find().select("-password").sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         count: users.length,
         data: users,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

// @desc    Delete user and all associated data
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);

      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Delete user's posts
      await Post.deleteMany({ user: req.params.id });

      // Delete user's comments from all posts
      await Post.updateMany({ "comments.user": req.params.id }, { $pull: { comments: { user: req.params.id } } });

      // Remove user from followers/following lists
      await User.updateMany(
         { $or: [{ followers: req.params.id }, { following: req.params.id }] },
         {
            $pull: {
               followers: req.params.id,
               following: req.params.id,
            },
         },
      );

      // Delete user's notifications
      await Notification.deleteMany({ recipient: req.params.id });

      // Delete the user
      await user.deleteOne();

      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

// @desc    Get all reported posts
// @route   GET /api/admin/posts/reported
// @access  Admin
exports.getReportedPosts = async (req, res) => {
   try {
      const reportedPosts = await Post.find({ reports: { $exists: true, $not: { $size: 0 } } })
         .populate("user", "name username profileImage")
         .populate("reports.user", "name username")
         .sort({ "reports.length": -1 });

      res.status(200).json({
         success: true,
         count: reportedPosts.length,
         data: reportedPosts,
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

// @desc    Delete a post
// @route   DELETE /api/admin/posts/:id
// @access  Admin
exports.deletePost = async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      await post.deleteOne();

      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

// @desc    Send notification to all users
// @route   POST /api/admin/notifications/broadcast
// @access  Admin
exports.broadcastNotification = async (req, res) => {
   try {
      const { title, message } = req.body;

      if (!title || !message) {
         return res.status(400).json({
            success: false,
            error: "Please provide both title and message",
         });
      }

      // Get all users
      const users = await User.find();

      // Create notifications for all users
      const notifications = users.map((user) => ({
         recipient: user._id,
         type: "ADMIN_BROADCAST",
         title: title,
         content: message,
         read: false,
      }));

      await Notification.insertMany(notifications);

      res.status(200).json({
         success: true,
         message: `Notification sent to ${users.length} users`,
         data: {
            recipientCount: users.length,
         },
      });
   } catch (error) {
      console.error("Broadcast notification error:", error);
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
   try {
      const totalUsers = await User.countDocuments();
      const totalPosts = await Post.countDocuments();
      const reportedPosts = await Post.countDocuments({ reports: { $exists: true, $not: { $size: 0 } } });
      const recentUsers = await User.find().select("name username createdAt").sort({ createdAt: -1 }).limit(5);

      res.status(200).json({
         success: true,
         data: {
            totalUsers,
            totalPosts,
            reportedPosts,
            recentUsers,
         },
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         error: "Server Error",
      });
   }
};
