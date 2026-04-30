const userService = require("../services/user.service");
const mapUser = require("../helpers/mapUser");

async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.send({ data: users.map(mapUser), error: null });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Ошибка при получении пользователей" });
  }
}

async function getRoles(req, res) {
  const roles = userService.getRoles();
  res.send({ data: roles });
}

async function updateUser(req, res) {
  try {
    const newUser = await userService.updateUser(req.params.id, {
      role: req.body.roleId,
    });
    res.send({ data: mapUser(newUser), error: null });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Ошибка при обновлении пользователя" });
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    res.send({ error: null });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Ошибка при удалении пользователя" });
  }
}

async function updateFavorites(req, res) {
  try {
    const updatedFavorites = await userService.updateFavorites(
      req.user.id,
      req.params.restaurantId,
    );

    res.send({ data: updatedFavorites, error: null });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Не удалось обновить избранное" });
  }
}

async function getMe(req, res) {
  try {
    const user = await userService.getFavorites(req.user.id);
    res.send({ data: mapUser(user) });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

module.exports = {
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
  updateFavorites,
  getMe,
};
