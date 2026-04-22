const mongoose = require("mongoose");
const mapRestaurant = require("./mapRestaurant");

module.exports = function (user) {
  return {
    id: user.id,
    login: user.login,
    roleId: user.role,
    registeredAt: user.createdAt,
    favorites: user.favorites.map((fav) =>
      mongoose.isObjectIdOrHexString(fav) ? fav : mapRestaurant(fav),
    ),
  };
};
