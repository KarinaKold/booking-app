const express = require("express");
const {
  getUsers,
  getRoles,
  updateUser,
  deleteUser,
  updateFavorites,
  getMe,
} = require("../controllers/user.controller");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole([ROLES.ADMIN]), getUsers);
router.get("/roles", authenticated, hasRole([ROLES.ADMIN]), getRoles);
router.get("/me", authenticated, getMe);
router.patch("/favorites/:restaurantId", authenticated, updateFavorites);
router.patch("/:id", authenticated, hasRole([ROLES.ADMIN]), updateUser);
router.delete("/:id", authenticated, hasRole([ROLES.ADMIN]), deleteUser);

module.exports = router;
