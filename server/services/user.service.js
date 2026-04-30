const User = require("../models/User");
const ROLES = require("../constants/roles");

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.MODERATOR, name: "Moderator" },
    { id: ROLES.USER, name: "User" },
  ];
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

async function updateFavorites(userId, restaurantId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const isFavorite = user.favorites.some(
    (fav) =>
      (fav._id ? fav._id.toString() : fav.toString()) ===
      restaurantId.toString(),
  );

  const update = isFavorite
    ? { $pull: { favorites: restaurantId } }
    : { $addToSet: { favorites: restaurantId } };

  await User.findByIdAndUpdate(userId, update);

  const updatedUser = await User.findById(userId);
  return updatedUser.favorites;
}

async function getFavorites(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Пользователь не найден");
  }
  return user;
}

module.exports = {
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
  updateFavorites,
  getFavorites,
};
