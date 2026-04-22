const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");
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

  await newRestaurant.populate({
    path: "comments",
    populate: "author",
  });

  return newRestaurant;
}

function deleteRestaurant(id) {
  return Restaurant.deleteOne({ _id: id });
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
  } = params;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (cuisines) query.cuisine = { $in: cuisines.split(",") };
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (hasBarCard === "true" || hasBarCard === true) query.hasBarCard = true;
  // все рестораны, подходящие под фильтры
  let restaurants = await Restaurant.find(query).sort({ createdAt: -1 });
  // Фильтрация "Открыто сейчас" на стороне сервера
  if (openNow === "true" || openNow === true) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Текущее время в минутах

    restaurants = restaurants.filter((rest) => {
      if (!rest.workingHours || !rest.workingHours.includes(" - "))
        return false;

      const [start, end] = rest.workingHours.split(" - ");
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      let endMinutes = endH * 60 + endM;

      // работающие после полуночи (например, до 02:00)
      if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60;
      }
      // Если ночь и проверяем
      const isCurrentNight =
        currentTime < startMinutes && currentTime < endMinutes - 24 * 60;
      const effectiveCurrentTime = isCurrentNight
        ? currentTime + 24 * 60
        : currentTime;

      return (
        effectiveCurrentTime >= startMinutes &&
        effectiveCurrentTime < endMinutes
      );
    });
  }

  const count = restaurants.length;
  const pagedRestaurants = restaurants.slice((page - 1) * limit, page * limit);
  // const pagedRestaurants = restaurants.skip((page - 1) * limit);
  return {
    restaurants: pagedRestaurants,
    lastPage: Math.ceil(count / limit),
  };
}

function getRestaurant(id) {
  return Restaurant.findById(id).populate({
    path: "comments",
    populate: "author",
  });
}

async function getOwnRestaurants(ownerId) {
  const restaurants = await Restaurant.find({ owner: ownerId }).sort({
    createdAt: -1,
  });

  return restaurants;
}

const getFavoritesDetails = async (favoriteIds) => {
  try {
    // Если избранного нет, сразу возвращаем пустой массив
    if (!favoriteIds || favoriteIds.length === 0) {
      return [];
    }
    // Очищаем массив
    const validIds = favoriteIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
    // Выполняем поиск
    return await Restaurant.find({
      _id: { $in: validIds },
    });
  } catch (error) {
    throw new Error("Ошибка базы данных при получении избранного");
  }
};

const getFiltersMetadata = async () => {
  const cuisines = await Restaurant.distinct("cuisine");
  return cuisines.filter(Boolean);
};

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
