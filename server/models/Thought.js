const mongoose = require("mongoose");

const thoughtSchema = new mongoose.Schema(
   {
      content: {
         type: String,
         required: true,
         trim: true,
      },
      type: {
         type: String,
         enum: ["text", "link"],
         default: "text",
      },
      topics: [
         {
            type: String,
            trim: true,
            lowercase: true,
         },
      ],
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      likes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      comments: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
            },
            content: {
               type: String,
               required: true,
               trim: true,
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      expiresAt: {
         type: Date,
         required: true,
         default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
      savedToHighlights: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   },
);

// Index for expiration
thoughtSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for topics for faster trending topic aggregation
thoughtSchema.index({ topics: 1, createdAt: -1 });

// Middleware to populate user fields
thoughtSchema.pre("find", function () {
   this.populate("user", "name username profileImage");
});

thoughtSchema.pre("findOne", function () {
   this.populate("user", "name username profileImage");
});

// Virtual field for like count
thoughtSchema.virtual("likeCount").get(function () {
   return this.likes.length;
});

// Virtual field for comment count
thoughtSchema.virtual("commentCount").get(function () {
   return this.comments.length;
});

// Method to check if thought is expired
thoughtSchema.methods.isExpired = function () {
   return new Date() > this.expiresAt;
};

// Method to save to highlights
thoughtSchema.methods.saveToHighlights = function () {
   this.savedToHighlights = true;
   this.expiresAt = null; // Remove expiration when saved to highlights
   return this.save();
};

// Static method to get trending topics
thoughtSchema.statics.getTrendingTopics = async function (limit = 5) {
   const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

   return this.aggregate([
      {
         $match: {
            createdAt: { $gte: twentyFourHoursAgo },
            topics: { $exists: true, $ne: [] },
         },
      },
      { $unwind: "$topics" },
      {
         $group: {
            _id: "$topics",
            count: { $sum: 1 },
         },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
         $project: {
            _id: 0,
            name: "$_id",
            count: 1,
         },
      },
   ]);
};

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
