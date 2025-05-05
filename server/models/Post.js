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
         maxlength: [1000, "Content cannot be more than 1000 characters"],
      },
      media: [
         {
            type: String,
         },
      ],
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
            text: {
               type: String,
               required: true,
               maxlength: [500, "Comment cannot be more than 500 characters"],
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      location: {
         type: String,
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
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

module.exports = mongoose.model("Post", PostSchema);
