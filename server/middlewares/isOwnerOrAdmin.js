const Restaurant = require("../models/Restaurant");
const ROLES = require("../constants/roles");

module.exports = async function (req, res, next) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).send({ error: "Ресторан не найден" });
    }

    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    if (
      req.user.role === ROLES.MODERATOR &&
      restaurant.owner.toString() === req.user.id
    ) {
      return next();
    }

    res.status(403).send({ error: "У вас нет прав на это действие" });
  } catch (e) {
    res.status(500).send({ error: "Ошибка сервера при проверке прав" });
  }
};
