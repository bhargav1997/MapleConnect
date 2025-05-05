const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
   try {
      // Add user to req.body
      req.body.user = req.user.id;

      // Handle media files
      if (req.files && req.files.length > 0) {
         req.body.media = req.files.map((file) => file.filename);
      }

      // Extract hashtags from content
      if (req.body.content) {
         const hashtagRegex = /#(\w+)/g;
         const hashtags = [];
         let match;

         while ((match = hashtagRegex.exec(req.body.content)) !== null) {
            hashtags.push(match[1]);
         }

         if (hashtags.length > 0) {
            req.body.hashtags = hashtags;
         }
      }

      // Handle tagged users
      if (req.body.taggedUserIds && Array.isArray(req.body.taggedUserIds)) {
         req.body.taggedUsers = req.body.taggedUserIds;
         delete req.body.taggedUserIds;
      }

      // Handle poll if present
      if (req.body.pollQuestion && req.body.pollOptions && Array.isArray(req.body.pollOptions)) {
         req.body.poll = {
            question: req.body.pollQuestion,
            options: req.body.pollOptions.map((option) => ({
               text: option,
               votes: [],
            })),
         };

         if (req.body.pollExpiration) {
            req.body.poll.expiresAt = new Date(req.body.pollExpiration);
         }

         delete req.body.pollQuestion;
         delete req.body.pollOptions;
         delete req.body.pollExpiration;
      }

      const post = await Post.create(req.body);

      // Populate user info for the new post
      const populatedPost = await Post.findById(post._id)
         .populate("user", "name username profileImage")
         .populate("taggedUsers", "name username profileImage");

      res.status(201).json({
         success: true,
         data: populatedPost,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
   try {
      // Get posts from users that the current user follows and their own posts
      const following = req.user.following;
      following.push(req.user.id); // Include own posts

      const posts = await Post.find({ user: { $in: following } })
         .sort("-createdAt")
         .populate("user", "name profileImage")
         .populate("comments.user", "name profileImage");

      res.status(200).json({
         success: true,
         count: posts.length,
         data: posts,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id).populate("user", "name profileImage").populate("comments.user", "name profileImage");

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      res.status(200).json({
         success: true,
         data: post,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
   try {
      let post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Make sure user is post owner
      if (post.user.toString() !== req.user.id) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to update this post",
         });
      }

      // Handle media files
      if (req.files && req.files.length > 0) {
         req.body.media = req.files.map((file) => file.filename);
      }

      post = await Post.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      });

      res.status(200).json({
         success: true,
         data: post,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Make sure user is post owner
      if (post.user.toString() !== req.user.id) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to delete this post",
         });
      }

      await post.deleteOne();

      res.status(200).json({
         success: true,
         data: {},
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Like post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Check if the post has already been liked by this user
      if (post.likes.includes(req.user.id)) {
         return res.status(400).json({
            success: false,
            error: "Post already liked",
         });
      }

      // Add user id to likes array
      post.likes.push(req.user.id);
      await post.save();

      res.status(200).json({
         success: true,
         data: post,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Unlike post
// @route   PUT /api/posts/:id/unlike
// @access  Private
exports.unlikePost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Check if the post has not been liked by this user
      if (!post.likes.includes(req.user.id)) {
         return res.status(400).json({
            success: false,
            error: "Post has not yet been liked",
         });
      }

      // Remove user id from likes array
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id.toString());
      await post.save();

      res.status(200).json({
         success: true,
         data: post,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Create new comment
      const newComment = {
         user: req.user.id,
         text: req.body.text,
      };

      // Add to comments array
      post.comments.push(newComment);
      await post.save();

      // Populate user info for the new comment
      const populatedPost = await Post.findById(req.params.id)
         .populate("user", "name profileImage")
         .populate("comments.user", "name profileImage");

      res.status(201).json({
         success: true,
         data: populatedPost,
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Delete comment from post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Find the comment
      const comment = post.comments.find((comment) => comment._id.toString() === req.params.commentId);

      if (!comment) {
         return res.status(404).json({
            success: false,
            error: "Comment not found",
         });
      }

      // Check if user is comment owner or post owner
      if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
         return res.status(401).json({
            success: false,
            error: "Not authorized to delete this comment",
         });
      }

      // Remove comment
      post.comments = post.comments.filter((comment) => comment._id.toString() !== req.params.commentId);
      await post.save();

      res.status(200).json({
         success: true,
         data: post,
      });
   } catch (err) {
      next(err);
   }
};
