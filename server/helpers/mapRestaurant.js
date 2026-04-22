const mongoose = require("mongoose");
const mapComment = require("./mapComment");

module.exports = function (restaurant) {
  return {
    id: restaurant._id ? restaurant._id.toString() : restaurant.id,
    name: restaurant.name,
    imageUrl:
      restaurant.images && restaurant.images.length > 0
        ? restaurant.images[0]
        : "",
    images: restaurant.images,
    rating: restaurant.rating,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    hasBarCard: restaurant.hasBarCard,
    description: restaurant.description,
    workingHours: restaurant.workingHours,
    tables: restaurant.tables,
    comments: restaurant.comments.map((comment) =>
      mongoose.isObjectIdOrHexString(comment) ? comment : mapComment(comment),
    ),
    owner: restaurant.owner ? restaurant.owner.toString() : null,
    createdAt: restaurant.createdAt,
  };
};
