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
} = require("../controllers/users");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Protect all routes
router.use(protect);

router.route("/").get(getUsers);
router.route("/search").get(searchUsers);

router.route("/:id").get(getUser).put(updateUser);

router.route("/:id/profile-image").put(upload.single("profileImage"), updateProfileImage);

router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);
router.route("/:id/posts").get(getUserPosts);

module.exports = router;
