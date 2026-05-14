const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

async function addRestaurant(restaurant) {
  const newRestaurant = await Restaurant.create(restaurant);

  await newRestaurant.populate({
    path: "comments",
    populate: "author",
  });

  return newRestaurant;
}

async function editRestaurant(id, restaurant) {
  const newRestaurant = await Restaurant.findByIdAndUpdate(id, restaurant, {
    returnDocument: "after",
  });

  if (!newRestaurant) {
    throw new Error("Ресторан не найден");
  }

  await newRestaurant.populate({
    path: "comments",
    populate: "author",
  });

  return newRestaurant;
}

async function deleteRestaurant(id) {
  const res = await Restaurant.deleteOne({ _id: id });
  if (res.deletedCount === 0) {
    throw new Error("Ресторан не найден");
  }
  return res;
}

async function getRestaurants(params) {
  const {
    search = "",
    page = 1,
    limit = 10,
    cuisines,
    minRating,
    hasBarCard,
    openNow,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (cuisines) query.cuisine = { $in: cuisines.split(",") };
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (hasBarCard === "true" || hasBarCard === true) query.hasBarCard = true;

  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  if (openNow === "true" || openNow === true) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    query.$or = [
      {
        $and: [
          { startTime: { $lte: currentTime } },
          { endTime: { $gt: currentTime } },
          { $expr: { $gt: ["$endTime", "$startTime"] } },
        ],
      },
      {
        $and: [
          { $expr: { $lt: ["$endTime", "$startTime"] } },
          {
            $or: [
              { startTime: { $lte: currentTime } },
              { endTime: { $gt: currentTime } },
            ],
          },
        ],
      },
    ];
  }

  const [restaurants, count] = await Promise.all([
    Restaurant.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort),
    Restaurant.countDocuments(query),
  ]);

  return {
    restaurants,
    lastPage: Math.ceil(count / limit),
  };
}

async function getRestaurant(id) {
  const restaurant = await Restaurant.findById(id).populate({
    path: "comments",
    options: { sort: { createdAt: -1 } },
    populate: "author",
  });

  if (!restaurant) {
    throw new Error("Ресторан не найден");
  }

  return restaurant;
}

async function getOwnRestaurants(ownerId) {
  const restaurants = await Restaurant.find({ owner: ownerId }).sort({
    createdAt: -1,
  });

  return restaurants;
}

async function getFavoritesDetails(favoriteIds) {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
      return [];
    }

    const validIds = favoriteIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    return await Restaurant.find({
      _id: { $in: validIds },
    });
  } catch (error) {
    throw new Error("Ошибка при получении избранного");
  }
}

async function getFiltersMetadata() {
  const cuisines = await Restaurant.distinct("cuisine");
  return cuisines.filter(Boolean);
}

module.exports = {
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
  getRestaurants,
  getRestaurant,
  getOwnRestaurants,
  getFavoritesDetails,
  getFiltersMetadata,
};
