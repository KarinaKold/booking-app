const express = require("express");
const {
  getBusyTables,
  addBooking,
  deleteBooking,
  getUserBookings,
} = require("../controllers/booking.controller");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.get("/", getBusyTables);
router.post("/", authenticated, addBooking);
router.delete("/:id", authenticated, deleteBooking);
router.get("/user", authenticated, getUserBookings);

module.exports = router;
