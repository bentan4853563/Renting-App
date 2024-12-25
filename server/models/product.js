const mongoose = require('mongoose');

// Define the schema for your model
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
    },
    primaryPhoto: {
      type: String, // URL or path to the primary photo
      required: true,
    },
    secondaryPhotos: {
      type: [String], // Array of URLs or paths for secondary photos
      default: [],
    },
    videos: {
      type: [String], // Array of video URLs or paths
      default: [],
    },
    rentalCostPerDay: {
      type: Number,
      required: true, // Rental cost is required
    },
    type: {
      type: String,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'], // Only allow these values
      default: 'Draft', // Default status
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Product = mongoose.model('Product', ProductSchema);

// Export the model
module.exports = Product;