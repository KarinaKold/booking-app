const commentService = require("../services/comment.service");
const mapComment = require("../helpers/mapComment");

async function addComment(req, res) {
  try {
    const newComment = await commentService.addComment(req.params.id, {
      content: req.body.content,
      rating: req.body.rating,
      author: req.user.id,
    });
    res.send({ data: mapComment(newComment) });
  } catch (e) {
    res.status(500).send({ error: "Не удалось добавить комментарий" });
  }
}

async function deleteComment(req, res) {
  try {
    await commentService.deleteComment(
      req.params.restaurantId,
      req.params.commentId,
    );
    res.send({ error: null });
  } catch (e) {
    res.status(400).send({ error: "Не удалось удалить комментарий" });
  }
}

module.exports = {
  addComment,
  deleteComment,
};
