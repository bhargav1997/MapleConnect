const express = require("express");
const {
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
   updateAccountSettings,
   deleteUser,
} = require("../controllers/users");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const User = require("../models/User");

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getUsers);
router.route("/search").get(searchUsers);
router.route("/suggested").get(getSuggestedUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/settings").put(updateAccountSettings);

router.route("/:id/profile-image").put(upload.single("profileImage"), updateProfileImage);

router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);
router.route("/:id/posts").get(getUserPosts);

// Get user's followers
router.get("/:userId/followers", getFollowers);

// Get user's following
router.get("/:userId/following", getFollowing);

// Add this route to handle feed preferences
router.put("/feed-preferences", async (req, res) => {
   try {
      const user = await User.findById(req.user.id);
      if (!user) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      user.feedPreferences = {
         ...user.feedPreferences,
         ...req.body,
      };

      await user.save();

      res.status(200).json({
         success: true,
         data: user.feedPreferences,
      });
   } catch (err) {
      console.error("Error updating feed preferences:", err);
      res.status(500).json({
         success: false,
         error: "Server error",
      });
   }
});

module.exports = router;
