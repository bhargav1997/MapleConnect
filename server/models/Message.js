const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
   {
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      receiver: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         enum: ["text", "image", "file"],
         default: "text",
      },
      readBy: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      deletedFor: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
   },
   {
      timestamps: true,
   },
);

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
