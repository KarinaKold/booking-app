const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/auth.controller");
const authenticated = require("../middlewares/authenticated");

const router = express.Router({ mergeParams: true });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticated, getMe);

module.exports = router;
