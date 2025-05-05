const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: [
        'new_follower',
        'post_like',
        'post_comment',
        'comment_reply',
        'group_invite',
        'group_join',
        'event_invite',
        'event_update',
        'message',
        'marketplace_interest'
      ],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityModel'
    },
    entityModel: {
      type: String,
      enum: ['Post', 'Comment', 'User', 'Group', 'Event', 'Message', 'Marketplace']
    },
    link: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for faster queries
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
