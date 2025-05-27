const User = require("../models/User");
const Post = require("../models/Post");

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
   try {
      const users = await User.find().select("-password");

      res.status(200).json({
         success: true,
         count: users.length,
         data: users,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
   try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      res.status(200).json({
         success: true,
         data: user,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
   try {
      // Make sure user is updating their own profile
      if (req.params.id !== req.user.id.toString()) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to update this user",
         });
      }

      // Check if username is being updated and if it already exists
      if (req.body.username) {
         const existingUser = await User.findOne({
            username: req.body.username,
            _id: { $ne: req.params.id }, // Exclude current user
         });

         if (existingUser) {
            return res.status(400).json({
               success: false,
               error: "Username already taken",
            });
         }
      }

      // Fields to update
      const fieldsToUpdate = {
         name: req.body.name,
         username: req.body.username,
         bio: req.body.bio,
         location: req.body.location,
      };

      const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
         new: true,
         runValidators: true,
      });

      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      res.status(200).json({
         success: true,
         data: user,
      });
   } catch (err) {
      // Handle validation errors
      if (err.name === "ValidationError") {
         const messages = Object.values(err.errors).map((val) => val.message);
         return res.status(400).json({
            success: false,
            error: messages.join(", "),
         });
      }
      next(err);
   }
};

// @desc    Update profile image
// @route   PUT /api/users/:id/profile-image
// @access  Private
const updateProfileImage = async (req, res, next) => {
   try {
      // Make sure user is updating their own profile
      if (req.params.id !== req.user.id.toString()) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to update this user",
         });
      }

      if (!req.file) {
         return res.status(400).json({
            success: false,
            error: "Please upload a file",
         });
      }

      const user = await User.findByIdAndUpdate(
         req.params.id,
         { profileImage: req.file.filename },
         {
            new: true,
            runValidators: true,
         },
      );

      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      res.status(200).json({
         success: true,
         data: user,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Follow user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = async (req, res, next) => {
   try {
      // Check if user exists
      const userToFollow = await User.findById(req.params.id);

      if (!userToFollow) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Check if user is trying to follow themselves
      if (req.params.id === req.user.id.toString()) {
         return res.status(400).json({
            success: false,
            error: "You cannot follow yourself",
         });
      }

      // Check if already following
      if (req.user.following.includes(req.params.id) || userToFollow.followers.includes(req.user.id)) {
         return res.status(400).json({
            success: false,
            error: "You are already following this user",
         });
      }

      // Add to following array
      await User.findByIdAndUpdate(req.user.id, {
         $push: { following: req.params.id },
      });

      // Add to followers array
      await User.findByIdAndUpdate(req.params.id, {
         $push: { followers: req.user.id },
      });

      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Unfollow user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res, next) => {
   try {
      // Check if user exists
      const userToUnfollow = await User.findById(req.params.id);

      if (!userToUnfollow) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Check if user is trying to unfollow themselves
      if (req.params.id === req.user.id.toString()) {
         return res.status(400).json({
            success: false,
            error: "You cannot unfollow yourself",
         });
      }

      // Check if not following
      if (!req.user.following.includes(req.params.id) || !userToUnfollow.followers.includes(req.user.id)) {
         return res.status(400).json({
            success: false,
            error: "You are not following this user",
         });
      }

      // Remove from following array
      await User.findByIdAndUpdate(req.user.id, {
         $pull: { following: req.params.id },
      });

      // Remove from followers array
      await User.findByIdAndUpdate(req.params.id, {
         $pull: { followers: req.user.id },
      });

      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get user posts
// @route   GET /api/users/:id/posts
// @access  Private
const getUserPosts = async (req, res, next) => {
   try {
      const posts = await Post.find({ user: req.params.id })
         .sort("-createdAt")
         .populate("user", "name profileImage username")
         .populate("comments.user", "name profileImage username");

      res.status(200).json({
         success: true,
         count: posts.length,
         data: posts,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res, next) => {
   try {
      const query = req.query.query;

      if (!query) {
         return res.status(400).json({
            success: false,
            error: "Please provide a search query",
         });
      }

      // Search by name, username, or email
      const users = await User.find({
         $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
         ],
      })
         .select("name username profileImage username")
         .limit(10);

      res.status(200).json({
         success: true,
         count: users.length,
         data: users,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
const getSuggestedUsers = async (req, res, next) => {
   try {
      // Get users that the current user is not following and not the current user
      const suggestedUsers = await User.find({
         _id: {
            $nin: [...req.user.following, req.user.id], // Exclude users being followed and current user
         },
      })
         .select("name username bio profileImage followers following")
         .limit(10);

      res.status(200).json({
         success: true,
         data: suggestedUsers,
      });
   } catch (err) {
      next(err);
   }
};

// Get user's followers
const getFollowers = async (req, res) => {
   try {
      const user = await User.findById(req.params.userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      const followers = await User.find({ _id: { $in: user.followers } })
         .select("_id name email profileImage bio username")
         .sort({ createdAt: -1 });

      res.json(followers);
   } catch (error) {
      console.error("Error getting followers:", error);
      res.status(500).json({ message: "Error getting followers" });
   }
};

// Get user's following
const getFollowing = async (req, res) => {
   try {
      const user = await User.findById(req.params.userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      const following = await User.find({ _id: { $in: user.following } })
         .select("_id name email profileImage bio username")
         .sort({ createdAt: -1 });

      res.json(following);
   } catch (error) {
      console.error("Error getting following:", error);
      res.status(500).json({ message: "Error getting following" });
   }
};

module.exports = {
   getUsers,
   getUser,
   updateUser,
   updateProfileImage,
   followUser,
   unfollowUser,
   getUserPosts,
   searchUsers,
   getSuggestedUsers,
   getFollowers,
   getFollowing,
};
