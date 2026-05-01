const commentService = require("../services/comment.service");
const mapComment = require("../helpers/mapComment");

async function addComment(req, res) {
  try {
    const { comment, newRating } = await commentService.addComment(
      req.params.id,
      {
        content: req.body.content,
        rating: req.body.rating,
        author: req.user.id,
      },
    );

    res.send({
      data: {
        comment: mapComment(comment),
        updatedRating: newRating,
      },
    });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Не удалось добавить комментарий" });
  }
}

async function deleteComment(req, res) {
  try {
    await commentService.deleteComment(
      req.params.restaurantId,
      req.params.commentId,
    );

    res.send({
      data: { updatedRating: newRating },
      error: null,
    });
  } catch (e) {
    res
      .status(500)
      .send({ error: e.message || "Не удалось удалить комментарий" });
  }
}

module.exports = {
  addComment,
  deleteComment,
};
