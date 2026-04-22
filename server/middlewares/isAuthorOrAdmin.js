const Comment = require("../models/Comment");
const ROLES = require("../constants/roles");

module.exports = async function (req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).send({ error: "Комментарий не найден" });
    }

    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    if (comment.author.toString() === req.user.id) {
      return next();
    }

    res.status(403).send({ error: "У вас нет прав на это действие" });
  } catch (e) {
    res.status(500).send({ error: "Ошибка сервера при проверке прав" });
  }
};
