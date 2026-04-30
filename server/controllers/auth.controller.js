const { registerUser, loginUser } = require("../services/auth.service");
const mapUser = require("../helpers/mapUser");

async function register(req, res) {
  try {
    const { user, token } = await registerUser(
      req.body.login,
      req.body.password,
    );

    res.cookie("token", token, { httpOnly: true }).send({
      error: null,
      user: mapUser(user),
    });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
}

async function login(req, res) {
  try {
    const { user, token } = await loginUser(req.body.login, req.body.password);

    res.cookie("token", token, { httpOnly: true }).send({
      error: null,
      user: mapUser(user),
    });
  } catch (e) {
    res.send({ error: e.message || "Unknown error" });
  }
}

async function logout(req, res) {
  res.clearCookie("token").send({});
}
// router.post("/logout", (req, res) => {
//   res.cookie("token", "", { httpOnly: true }).send({});
// });
// async function getMe(req, res) {
//   try {
//     const user = await getFavorites(req.user.id);
//     res.send({ data: mapUser(user) });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// }

module.exports = { register, login, logout };
