const Booking = require("../models/Booking");
const ROLES = require("../constants/roles");

async function getBusyTables(restaurantId, date, time) {
  const bookings = await Booking.find({
    restaurant: restaurantId,
    date,
    time,
  });

  return bookings.map((b) => b.tableNumber);
}

async function addBooking(bookingData) {
  const newBooking = await Booking.create(bookingData);
  return newBooking;
}

async function deleteBooking(bookingId, userId, userRole) {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Бронирование не найдено");
  }

  const isPrivilegedUser = [ROLES.ADMIN, ROLES.MODERATOR].includes(userRole);
  const isOwner = booking.user.toString() === userId.toString();

  if (!isOwner && !isPrivilegedUser) {
    throw new Error("У вас нет прав на отмену этого бронирования");
  }

  await Booking.deleteOne({ _id: bookingId });
}

async function getUserBookings(userId) {
  const booking = await Booking.find({ user: userId })
    .populate("restaurant", "name address")
    .sort({ createdAt: -1 });

  if (!booking) {
    throw new Error("Бронирование не найдено");
  }

  return booking;
}

module.exports = {
  getBusyTables,
  addBooking,
  deleteBooking,
  getUserBookings,
};
