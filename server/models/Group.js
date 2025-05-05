const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a group name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    image: {
      type: String,
      default: 'default-group.jpg'
    },
    coverImage: {
      type: String,
      default: 'default-group-cover.jpg'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot be more than 100 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add creator to admins and members arrays
GroupSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.admins.push(this.creator);
    this.members.push(this.creator);
  }
  next();
});

module.exports = mongoose.model('Group', GroupSchema);
