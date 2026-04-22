const express = require("express");
const {
  getBusyTables,
  addBooking,
  deleteBooking,
} = require("../controllers/booking");
const authenticated = require("../middlewares/authenticated");
const Booking = require("../models/Booking");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { date, time } = req.query;
    const { id } = req.params; // id из URL
    const busyTables = await getBusyTables(id, date, time);
    res.send({ data: busyTables });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.post("/", authenticated, async (req, res) => {
  try {
    const newBooking = await addBooking({
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
});

router.delete("/:id", authenticated, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    await deleteBooking(bookingId, userId, userRole);

    res.send({ error: null, success: true });
  } catch (e) {
    res.status(400).send({ error: "Не удалось отменить бронирование" });
  }
});

router.get("/user", authenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const userBookings = await Booking.find({ user: userId })
      .populate("restaurant", "name address")
      .sort({ createdAt: -1 });

    // const activeBookings = userBookings.filter((booking) => booking.restaurant);

    res.send({ data: userBookings });
  } catch (e) {
    console.error("ОШИБКА НА СЕРВЕРЕ:", e.message);
    res.status(500).send({ error: "Не удалось загрузить бронирования" });
  }
});

module.exports = router;
