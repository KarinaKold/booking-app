const express = require("express");
const {
  getUsers,
  getRoles,
  updateUser,
  deleteUser,
  updateFavorites,
  getFavorites,
} = require("../controllers/user");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  const users = await getUsers();

  res.send({ data: users.map(mapUser) });
});

router.get(
  "/roles",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const roles = getRoles();

    res.send({ data: roles });
  },
);

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const newUser = await updateUser(req.params.id, {
      role: req.body.roleId,
    });

    res.send({ data: mapUser(newUser) });
  },
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deleteUser(req.params.id);

    res.send({ error: null });
  },
);

router.patch("/favorites/:restaurantId", authenticated, async (req, res) => {
  try {
    const updatedFavorites = await updateFavorites(
      req.user.id,
      req.params.restaurantId,
    );

    res.send({ data: updatedFavorites });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Не удалось обновить избранное" });
  }
});

router.get("/me", authenticated, async (req, res) => {
  try {
    const user = await getFavorites(req.user.id);
    res.send({ data: mapUser(user) });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
