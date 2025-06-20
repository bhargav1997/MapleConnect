const Post = require("../models/Post");
const User = require("../models/User");
const { analyzeSentiment, detectToxicity } = require("../services/textAnalysis");

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
   try {
      // Add user to req.body
      req.body.user = req.user.id;

      // Handle image URLs if present
      if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
         req.body.imageUrls = req.body.imageUrls;
      }

      // Analyze content if present
      if (req.body.content) {
         // Extract hashtags
         const hashtagRegex = /#(\w+)/g;
         const hashtags = [];
         let match;

         while ((match = hashtagRegex.exec(req.body.content)) !== null) {
            hashtags.push(match[1]);
         }

         if (hashtags.length > 0) {
            req.body.hashtags = hashtags;
         }

         // Perform sentiment analysis
         const sentimentResult = await analyzeSentiment(req.body.content);
         req.body.sentiment = {
            mood: sentimentResult.mood.toUpperCase(),
            confidence: sentimentResult.confidence,
         };

         // Perform toxicity analysis
         const toxicityResult = await detectToxicity(req.body.content);
         req.body.toxicity = {
            isToxic: toxicityResult.isToxic,
            confidence: toxicityResult.confidence,
         };

         // If content is toxic with high confidence, reject the post
         if (toxicityResult.isToxic && toxicityResult.confidence > 0.8) {
            return res.status(400).json({
               success: false,
               error: "Your post contains inappropriate content and cannot be published.",
            });
         }
      }

      // Handle tagged users if present
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

      // Create the post
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
      console.error("Error creating post:", err);
      if (err.name === "ValidationError") {
         return res.status(400).json({
            success: false,
            error: Object.values(err.errors).map((val) => val.message)[0],
         });
      }
      next(err);
   }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
   try {
      const { type } = req.query;
      let query = {};
      let sort = {};

      // Get user's feed preferences
      const user = await User.findById(req.user.id);
      const prefs = user.feedPreferences || {};
      if (type === "trending") {
         const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

         query = {
            visibility: "public",
            isPrivate: false,
            createdAt: { $gte: thirtyDaysAgo },
         };

         const posts = await Post.aggregate([
            { $match: query },
            {
               $addFields: {
                  engagementScore: {
                     $add: [{ $size: "$likes" }, { $size: "$comments" }, 1],
                  },
               },
            },
            { $sort: { engagementScore: -1, createdAt: -1 } },
            { $limit: 50 },
         ]);

         await Post.populate(posts, [
            { path: "user", select: "name username profileImage" },
            { path: "comments.user", select: "name username profileImage" },
         ]);

         return res.status(200).json({
            success: true,
            data: posts,
         });
      } else if (type === "following") {
         // Get posts from users that the current user follows
         const following = user.following || [];

         query = {
            user: { $in: following },
            $or: [{ visibility: "public" }, { visibility: "friends", user: { $in: user.followers || [] } }],
            isPrivate: false,
         };

         const posts = await Post.find(query)
            .sort("-createdAt")
            .populate("user", "name username profileImage")
            .populate("comments.user", "name username profileImage")
            .populate("likes", "name username profileImage");

         return res.status(200).json({
            success: true,
            data: posts,
         });
      } else {
         // Build query based on user preferences
         const timeFilter = getTimeFilter(prefs.timeWindow);
         if (timeFilter) {
            query.createdAt = timeFilter;
         }

         // Content type filtering
         if (prefs.contentTypes && prefs.contentTypes.length > 0) {
            query.$or = prefs.contentTypes.map((type) => {
               if (type === "text") return { "images.0": { $exists: false }, poll: { $exists: false } };
               if (type === "images") return { "images.0": { $exists: true } };
               if (type === "polls") return { poll: { $exists: true } };
            });
         }

         // Topic filtering
         if (prefs.topicsOfInterest && prefs.topicsOfInterest.length > 0) {
            query.hashtags = { $in: prefs.topicsOfInterest };
         }
         if (prefs.excludedTopics && prefs.excludedTopics.length > 0) {
            query.hashtags = { ...query.hashtags, $nin: prefs.excludedTopics };
         }

         // Visibility and following filter
         const following = req.user.following;

         const visibilityQuery = prefs.prioritizeFollowing
            ? {
                 $or: [
                    {
                       user: { $in: following },
                       $or: [{ visibility: "public" }, { visibility: "friends" }],
                       isPrivate: false,
                    },
                    { visibility: "public", isPrivate: false },
                    { user: req.user.id }, // Include user's own posts
                 ],
              }
            : {
                 $or: [
                    { visibility: "public", isPrivate: false },
                    { user: req.user.id }, // Include user's own posts
                 ],
              };

         query = { ...query, ...visibilityQuery };

         // Sorting
         switch (prefs.sortBy) {
            case "popular":
               sort = { likesCount: -1, commentsCount: -1, createdAt: -1 };
               break;
            case "relevant":
               // Combine recency and popularity
               sort = {
                  score: {
                     $add: [
                        { $size: "$likes" },
                        { $size: "$comments" },
                        { $divide: [{ $subtract: ["$createdAt", new Date(0)] }, 86400000] },
                     ],
                  },
               };
               break;
            case "recent":
            default:
               sort = { createdAt: -1 };
         }

         const posts = await Post.find(query)
            .sort(sort)
            .populate("user", "name profileImage username")
            .populate("comments.user", "name profileImage username");

         return res.status(200).json({
            success: true,
            data: posts,
         });
      }
   } catch (err) {
      console.error("Error in getPosts:", err);
      next(err);
   }
};

// Helper function to get time filter
function getTimeFilter(timeWindow) {
   if (!timeWindow || timeWindow === "all") return null;

   const now = new Date();
   switch (timeWindow) {
      case "day":
         return { $gte: new Date(now - 24 * 60 * 60 * 1000) };
      case "week":
         return { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
      case "month":
         return { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
      default:
         return null;
   }
}

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
         content: req.body.content,
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

// @desc    Report post
// @route   POST /api/posts/:id/report
// @access  Private
exports.reportPost = async (req, res, next) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      // Check if user has already reported this post
      const alreadyReported = post.reports.some((report) => report.user.toString() === req.user.id);
      if (alreadyReported) {
         return res.status(400).json({
            success: false,
            error: "You have already reported this post",
         });
      }

      // Add report
      post.reports.push({
         user: req.user.id,
         reason: req.body.reason || "Inappropriate content",
      });

      await post.save();

      res.status(200).json({
         success: true,
         message: "Post reported successfully",
      });
   } catch (err) {
      next(err);
   }
};

// @desc    Get filtered following posts
// @route   GET /api/posts/following/:userId
// @access  Private
exports.getFilteredFollowingPosts = async (req, res, next) => {
   try {
      const { userId } = req.params;

      // Ensure user exists
      const targetUser = await User.findById(userId);
      if (!targetUser) {
         return res.status(404).json({
            success: false,
            error: "User not found",
         });
      }

      // Get posts from users that the target user follows
      // Exclude posts from the requesting user
      const query = {
         user: {
            $in: targetUser.following,
            $ne: req.user.id, // Exclude requesting user's posts
         },
         $or: [
            { visibility: "public" },
            {
               visibility: "friends",
               user: { $in: targetUser.followers }, // Only show friends posts if they follow back
            },
         ],
         isPrivate: false,
      };

      const posts = await Post.find(query)
         .sort("-createdAt")
         .populate("user", "name username profileImage")
         .populate("comments.user", "name username profileImage")
         .populate("likes", "name username profileImage");

      res.status(200).json({
         success: true,
         data: posts,
      });
   } catch (err) {
      console.error("Error in getFilteredFollowingPosts:", err);
      next(err);
   }
};

// @desc    Vote on a poll option
// @route   POST /api/posts/:id/vote
// @access  Private
exports.voteOnPoll = async (req, res, next) => {
   try {
      const { optionIndex } = req.body;
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).json({
            success: false,
            error: "Post not found",
         });
      }

      if (!post.poll) {
         return res.status(400).json({
            success: false,
            error: "This post does not have a poll",
         });
      }

      if (post.poll.expiresAt && new Date(post.poll.expiresAt) < new Date()) {
         return res.status(400).json({
            success: false,
            error: "This poll has ended",
         });
      }

      // Remove user's vote from all options
      post.poll.options.forEach((option) => {
         const voteIndex = option.votes.indexOf(req.user.id);
         if (voteIndex > -1) {
            option.votes.splice(voteIndex, 1);
         }
      });

      // Add vote to selected option
      post.poll.options[optionIndex].votes.push(req.user.id);
      await post.save();

      // Populate user info for the updated post
      const populatedPost = await Post.findById(post._id)
         .populate("user", "name username profileImage")
         .populate("taggedUsers", "name username profileImage");

      res.status(200).json({
         success: true,
         data: populatedPost,
      });
   } catch (err) {
      console.error("Error voting on poll:", err);
      next(err);
   }
};
