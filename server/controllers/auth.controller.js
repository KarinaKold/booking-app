const {
  registerUser,
  loginUser,
  findUserById,
} = require("../services/auth.service");
const mapUser = require("../helpers/mapUser");

async function register(req, res) {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login and password are required" });
    }

    const { user, token } = await registerUser(login);

    res.status(200).json({ token, user: mapUser(user) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
}

async function login(req, res) {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: "Login and password are required" });
    }

    const { user, token } = await loginUser(login, password);

    res.status(200).json({ token, user: mapUser(user) });
  } catch (e) {
    res.status(400).send({ error: e.message || "Unknown error" });
  }
}

async function logout(req, res) {
  try {
    res.status(204).send();
  } catch (e) {
    res.status(500).send({ error: e.message || "Unknown error" });
  }
}

async function getMe(req, res) {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ data: mapUser(user) });
  } catch (e) {
    res.status(500).send({ error: e.message || "Unknown error" });
  }
}

module.exports = { register, login, logout, getMe };
