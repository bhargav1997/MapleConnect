const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please add a price']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Electronics',
        'Furniture',
        'Clothing',
        'Books',
        'Sports',
        'Toys',
        'Vehicles',
        'Services',
        'Other'
      ]
    },
    condition: {
      type: String,
      required: [true, 'Please add the condition'],
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
    },
    images: [
      {
        type: String
      }
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold'],
      default: 'available'
    },
    isDeliveryAvailable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
