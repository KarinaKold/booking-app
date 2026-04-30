const bookingService = require("../services/booking.service");

async function getBusyTables(req, res) {
  try {
    const { date, time } = req.query;
    const { id } = req.params;
    const busyTables = await bookingService.getBusyTables(id, date, time);

    res.send({ data: busyTables });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function addBooking(req, res) {
  try {
    const newBooking = await bookingService.addBooking({
      restaurant: req.body.restaurantId,
      user: req.user.id,
      tableNumber: req.body.tableNumber,
      date: req.body.date,
      time: req.body.time,
    });

    res.send({ data: newBooking });
  } catch (e) {
    res.status(400).send({ error: "Этот стол уже занят на выбранное время" });
  }
}

async function deleteBooking(req, res) {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    await bookingService.deleteBooking(bookingId, userId, userRole);

    res.send({ error: null, success: true });
  } catch (e) {
    res.status(400).send({ error: "Не удалось отменить бронирование" });
  }
}

async function getUserBookings(req, res) {
  try {
    const userId = req.user.id;
    const userBookings = await bookingService.getUserBookings(userId);

    res.send({ data: userBookings });
  } catch (e) {
    res.status(500).send({ error: "Не удалось загрузить бронирования" });
  }
}

module.exports = {
  addBooking,
  deleteBooking,
  getBusyTables,
  getUserBookings,
};
