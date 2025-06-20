const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      content: {
         type: String,
         required: [true, "Please add some content"],
         trim: true,
         maxlength: [5000, "Post cannot be more than 5000 characters"],
      },
      imageUrls: [
         {
            type: String,
            validate: {
               validator: function (v) {
                  // Basic URL validation
                  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v);
               },
               message: (props) => `${props.value} is not a valid URL!`,
            },
         },
      ],
      location: {
         type: String,
         trim: true,
         maxlength: [100, "Location cannot be more than 100 characters"],
      },
      feeling: {
         type: String,
         maxlength: [50, "Feeling cannot be more than 50 characters"],
      },
      activity: {
         type: String,
         maxlength: [50, "Activity cannot be more than 50 characters"],
      },
      taggedUsers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      visibility: {
         type: String,
         enum: ["public", "friends", "private"],
         default: "public",
      },
      poll: {
         question: {
            type: String,
            maxlength: [200, "Poll question cannot be more than 200 characters"],
         },
         options: [
            {
               text: {
                  type: String,
                  maxlength: [100, "Poll option cannot be more than 100 characters"],
               },
               votes: [
                  {
                     type: mongoose.Schema.Types.ObjectId,
                     ref: "User",
                  },
               ],
            },
         ],
         expiresAt: {
            type: Date,
         },
      },
      hashtags: [
         {
            type: String,
         },
      ],
      group: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Group",
      },
      isPrivate: {
         type: Boolean,
         default: false,
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
               required: [true, "Please add a comment"],
               trim: true,
               maxlength: [1000, "Comment cannot be more than 1000 characters"],
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      reports: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
            },
            reason: {
               type: String,
               required: true,
               maxlength: [500, "Report reason cannot be more than 500 characters"],
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      sentiment: {
         mood: {
            type: String,
            enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"],
            default: "NEUTRAL",
         },
         confidence: {
            type: Number,
            min: 0,
            max: 1,
         },
      },
      toxicity: {
         isToxic: {
            type: Boolean,
            default: false,
         },
         confidence: {
            type: Number,
            min: 0,
            max: 1,
         },
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

// Virtual for likes count
PostSchema.virtual("likesCount").get(function () {
   return this.likes.length;
});

// Virtual for comments count
PostSchema.virtual("commentsCount").get(function () {
   return this.comments.length;
});

// Cascade delete comments when a post is deleted
PostSchema.pre("remove", async function (next) {
   await this.model("Comment").deleteMany({ post: this._id });
   next();
});

// Add indexes
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ visibility: 1 });
PostSchema.index({ content: "text" });

module.exports = mongoose.model("Post", PostSchema);
