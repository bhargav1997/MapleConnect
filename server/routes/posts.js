const express = require("express");
const {
   getPosts,
   getPost,
   createPost,
   updatePost,
   deletePost,
   likePost,
   unlikePost,
   addComment,
   deleteComment,
   reportPost,
   getFilteredFollowingPosts,
   voteOnPoll,
} = require("../controllers/posts");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Protect all routes
router.use(protect);

// Get filtered following posts
router.get("/following/:userId", getFilteredFollowingPosts);

router.route("/").get(getPosts).post(upload.array("media", 5), createPost);

router.route("/:id").get(getPost).put(upload.array("media", 5), updatePost).delete(deletePost);

router.route("/:id/like").put(likePost);
router.route("/:id/unlike").put(unlikePost);
router.route("/:id/comments").post(addComment);
router.route("/:id/comments/:commentId").delete(deleteComment);
router.route("/:id/report").post(reportPost);
router.route("/:id/vote").post(voteOnPoll);

module.exports = router;
