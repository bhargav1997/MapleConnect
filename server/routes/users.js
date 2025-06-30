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
   updateFeedPreference,
} = require("../controllers/users");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getUsers);
router.route("/search").get(searchUsers);
router.route("/suggested").get(getSuggestedUsers);

// Add this route to handle feed preferences
router.route("/feed-preferences").put(updateFeedPreference);

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

module.exports = router;
