const express = require("express");

const router = express.Router({ mergeParams: true });

router.use("/", require("./auth"));
router.use("/restaurants", require("./restaurant"));
router.use("/users", require("./user"));
router.use("/bookings", require("./booking"));

module.exports = router;
