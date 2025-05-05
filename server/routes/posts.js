const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} = require('../controllers/posts');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getPosts)
  .post(upload.array('media', 5), createPost);

router
  .route('/:id')
  .get(getPost)
  .put(upload.array('media', 5), updatePost)
  .delete(deletePost);

router.route('/:id/like').put(likePost);
router.route('/:id/unlike').put(unlikePost);
router.route('/:id/comments').post(addComment);
router.route('/:id/comments/:commentId').delete(deleteComment);

module.exports = router;
