const restaurantService = require("../services/restaurant.service");
const mapRestaurant = require("../helpers/mapRestaurant");
const User = require("../models/User");

async function getFavoritesDetails(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }

    const restaurants = await restaurantService.getFavoritesDetails(
      user.favorites,
    );
    res.send({ data: restaurants.map(mapRestaurant) });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Не удалось загрузить детали избранного" });
  }
}

async function getFiltersMetadata(req, res) {
  try {
    const cuisines = await restaurantService.getFiltersMetadata();
    res.send({ data: { cuisines } });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Не удалось загрузить данные фильтров" });
  }
}

async function getRestaurants(req, res) {
  try {
    const { restaurants, lastPage } = await restaurantService.getRestaurants(
      req.query,
    );
    res.send({
      data: {
        lastPage,
        restaurants: restaurants.map(mapRestaurant),
      },
    });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Ошибка при получении списка ресторанов" });
  }
}

async function getOwnRestaurants(req, res) {
  try {
    const myRestaurants = await restaurantService.getOwnRestaurants(
      req.user.id,
    );
    res.send({ data: myRestaurants.map(mapRestaurant) });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Не удалось загрузить ваши рестораны" });
  }
}

async function getRestaurant(req, res) {
  try {
    const restaurant = await restaurantService.getRestaurant(req.params.id);
    res.send({ data: mapRestaurant(restaurant) });
  } catch (e) {
    res.status(404).send({ error: e.message || "Ресторан не найден" });
  }
}

async function addRestaurant(req, res) {
  try {
    const newRestaurant = await restaurantService.addRestaurant({
      ...req.body,
      owner: req.user.id,
    });
    res.send({ data: mapRestaurant(newRestaurant), error: null });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Не удалось добавить ресторан" });
  }
}

async function editRestaurant(req, res) {
  try {
    const updatedRestaurant = await restaurantService.editRestaurant(
      req.params.id,
      req.body,
    );
    res.send({ data: mapRestaurant(updatedRestaurant), error: null });
  } catch (e) {
    res
      .status(400)
      .send({ error: e.message || "Не удалось обновить данные ресторана" });
  }
}

async function deleteRestaurant(req, res) {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    res.send({ error: null });
  } catch (e) {
    res.status(400).send({ error: e.message || "Не удалось удалить ресторан" });
  }
}

module.exports = {
  getFavoritesDetails,
  getFiltersMetadata,
  getRestaurants,
  getOwnRestaurants,
  getRestaurant,
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
};
