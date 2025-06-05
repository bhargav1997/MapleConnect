const Post = require("../models/Post");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const cloudinary = require("../config/cloudinary");

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
   // Add user to req.body
   req.body.user = req.user.id;

   const post = await Post.create(req.body);

   res.status(201).json({
      success: true,
      data: post,
   });
});

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
   const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || 10;
   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;

   // Get user's following list and include their own ID
   const following = req.user.following || [];
   following.push(req.user.id);

   // Get total count for pagination
   const total = await Post.countDocuments({ creator: { $in: following } });

   const posts = await Post.find({ creator: { $in: following } })
      .populate({
         path: "creator",
         select: "name profileImage",
      })
      .populate({
         path: "comments.user",
         select: "name profileImage",
      })
      .sort("-createdAt")
      .skip(startIndex)
      .limit(limit);

   // Pagination result
   const pagination = {};

   if (endIndex < total) {
      pagination.next = {
         page: page + 1,
         limit,
      };
   }

   if (startIndex > 0) {
      pagination.prev = {
         page: page - 1,
         limit,
      };
   }

   res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
   });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id)
      .populate({
         path: "creator",
         select: "name profileImage",
      })
      .populate({
         path: "comments.user",
         select: "name profileImage",
      });

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   res.status(200).json({
      success: true,
      data: post,
   });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
   let post = await Post.findById(req.params.id);

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   // Make sure user is post creator
   if (post.creator.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
   }

   // Handle image uploads
   if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
         return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
               file.path,
               {
                  folder: "posts",
                  resource_type: "auto",
               },
               (error, result) => {
                  if (error) {
                     reject(error);
                  } else {
                     resolve(result.secure_url);
                  }
               },
            );
         });
      });

      try {
         const uploadedUrls = await Promise.all(uploadPromises);
         req.body.images = [...(post.images || []), ...uploadedUrls];
      } catch (error) {
         return next(new ErrorResponse("Error uploading images", 500));
      }
   }

   post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
   });

   res.status(200).json({
      success: true,
      data: post,
   });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   // Make sure user is post creator
   if (post.creator.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
   }

   // Delete images from Cloudinary
   if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map((imageUrl) => {
         const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0];
         return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises);
   }

   await post.remove();

   res.status(200).json({
      success: true,
      data: {},
   });
});

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   // Check if the post has already been liked by this user
   const likeIndex = post.likes.indexOf(req.user.id);

   if (likeIndex === -1) {
      post.likes.push(req.user.id);
   } else {
      post.likes.splice(likeIndex, 1);
   }

   await post.save();

   res.status(200).json({
      success: true,
      data: post,
   });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   const newComment = {
      user: req.user.id,
      content: req.body.content,
   };

   post.comments.unshift(newComment);

   await post.save();

   res.status(200).json({
      success: true,
      data: post,
   });
});

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comments/:comment_id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.id);

   if (!post) {
      return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
   }

   // Pull out comment
   const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

   // Make sure comment exists
   if (!comment) {
      return next(new ErrorResponse(`Comment not found with id of ${req.params.comment_id}`, 404));
   }

   // Make sure user is comment creator
   if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this comment`, 401));
   }

   // Get remove index
   const removeIndex = post.comments.map((comment) => comment.id).indexOf(req.params.comment_id);

   post.comments.splice(removeIndex, 1);

   await post.save();

   res.status(200).json({
      success: true,
      data: post,
   });
});
