const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [1000, 'Message cannot be more than 1000 characters']
    },
    attachments: [
      {
        type: String
      }
    ],
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index on sender and recipient for faster queries
MessageSchema.index({ sender: 1, recipient: 1 });

module.exports = mongoose.model('Message', MessageSchema);
