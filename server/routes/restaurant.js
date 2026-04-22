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
} = require("../controllers/restaurant");
const { addComment, deleteComment } = require("../controllers/comment");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const isOwnerOrAdmin = require("../middlewares/isOwnerOrAdmin");
const isAuthorOrAdmin = require("../middlewares/isAuthorOrAdmin");
const mapRestaurant = require("../helpers/mapRestaurant");
const mapComment = require("../helpers/mapComment");
const ROLES = require("../constants/roles");
const bookingRouter = require("./booking");
const router = express.Router({ mergeParams: true });

router.get("/favorites-details", authenticated, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }

    const restaurants = await getFavoritesDetails(user.favorites);

    res.send({ data: restaurants.map(mapRestaurant) });
  } catch (e) {
    res.status(500).send({ error: "Не удалось загрузить детали избранного" });
  }
});

router.get("/filters/metadata", async (req, res) => {
  try {
    const cuisines = await getFiltersMetadata();
    res.send({ data: { cuisines } });
  } catch (e) {
    res.status(500).send({ error: "Не удалось загрузить данные фильтров" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { restaurants, lastPage } = await getRestaurants(req.query);

    res.send({
      data: {
        lastPage,
        restaurants: restaurants.map(mapRestaurant),
      },
    });
  } catch (e) {
    res.status(500).send({ error: "Ошибка при получении списка ресторанов" });
  }
});

router.get("/my", authenticated, async (req, res) => {
  try {
    const myRestaurants = await getOwnRestaurants(req.user.id);

    res.send({ data: myRestaurants.map(mapRestaurant) });
  } catch (e) {
    res.status(500).send({ error: "Не удалось загрузить ваши рестораны" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await getRestaurant(req.params.id);
    res.send({ data: mapRestaurant(restaurant) });
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

router.use("/:id/busy-tables", bookingRouter);

router.post("/:id/comments", authenticated, async (req, res) => {
  try {
    const newComment = await addComment(req.params.id, {
      content: req.body.content,
      rating: req.body.rating,
      author: req.user.id,
    });

    res.send({ data: mapComment(newComment) });
  } catch (e) {
    res.status(500).send({ error: "Не удалось добавить комментарий" });
  }
});

router.delete(
  "/:restaurantId/comments/:commentId",
  authenticated,
  isAuthorOrAdmin,
  async (req, res) => {
    await deleteComment(req.params.restaurantId, req.params.commentId);

    res.send({ error: null });
  },
);

router.post(
  "/",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    const newRestaurant = await addRestaurant({
      ...req.body,
      owner: req.user.id,
    });

    res.send({ data: mapRestaurant(newRestaurant) });
  },
);

router.patch("/:id", authenticated, isOwnerOrAdmin, async (req, res) => {
  const updatedRestaurant = await editRestaurant(req.params.id, req.body);

  res.send({ data: mapRestaurant(updatedRestaurant) });
});

router.delete("/:id", authenticated, isOwnerOrAdmin, async (req, res) => {
  await deleteRestaurant(req.params.id);

  res.send({ error: null });
});

module.exports = router;
