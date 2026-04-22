module.exports = function (comment) {
  return {
    id: comment._id,
    content: comment.content,
    rating: comment.rating || 5,
    author: comment.author?.login || "Пользователь удален",
    authorId: comment.author?._id || comment.author,
    publishedAt: comment.createdAt,
  };
};
