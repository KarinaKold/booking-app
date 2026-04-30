const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  getOwnRestaurants,
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
  getFavoritesDetails,
  getFiltersMetadata,
} = require("../controllers/restaurant.controller");
const {
  addComment,
  deleteComment,
} = require("../controllers/comment.controller");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const isOwnerOrAdmin = require("../middlewares/isOwnerOrAdmin");
const isAuthorOrAdmin = require("../middlewares/isAuthorOrAdmin");
const ROLES = require("../constants/roles");
const bookingRouter = require("./booking");

const router = express.Router({ mergeParams: true });

router.get("/favorites-details", authenticated, getFavoritesDetails);
router.get("/filters/metadata", getFiltersMetadata);
router.get("/my", authenticated, getOwnRestaurants);
router.get("/", getRestaurants);
router.get("/:id", getRestaurant);
router.use("/:id/busy-tables", bookingRouter);
router.post("/:id/comments", authenticated, addComment);
router.delete(
  "/:restaurantId/comments/:commentId",
  authenticated,
  isAuthorOrAdmin,
  deleteComment,
);
router.post(
  "/",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  addRestaurant,
);
router.patch("/:id", authenticated, isOwnerOrAdmin, editRestaurant);
router.delete("/:id", authenticated, isOwnerOrAdmin, deleteRestaurant);

module.exports = router;
