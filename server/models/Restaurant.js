const mongoose = require("mongoose");
const validator = require("validator");

const TableSchema = new mongoose.Schema({
  number: Number,
  seats: Number,
});

const RestaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    images: [
      {
        type: String,
        validate: {
          validator: validator.isURL,
          message: "Image should be a valid url",
        },
      },
    ],
    address: {
      type: String,
      required: true,
    },
    workingHours: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    hasBarCard: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    tables: [TableSchema],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
