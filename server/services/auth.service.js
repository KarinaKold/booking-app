const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");

async function registerUser(login, password) {
  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: passwordHash });
  const token = generate({ id: user.id });

  return { user, token };
}

async function loginUser(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user.id });
  return { token, user };
}

// async function getFavorites(userId) {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("Пользователь не найден");
//   }
//   return user;
// }

module.exports = {
  registerUser,
  loginUser,
};
