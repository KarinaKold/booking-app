const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Индекс для предотвращения двойного бронирования одного стола на одно время
BookingSchema.index(
  { restaurant: 1, tableNumber: 1, date: 1, time: 1 },
  { unique: true },
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
