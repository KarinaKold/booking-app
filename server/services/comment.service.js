const Comment = require("../models/Comment");
const Restaurant = require("../models/Restaurant");

async function updateRestaurantRating(restaurantId) {
  const allComments = await Comment.find({ restaurant: restaurantId });

  if (allComments.length === 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, { rating: 0 });
    return 0;
  }

  const totalRating = allComments.reduce((acc, comment) => {
    return acc + (comment.rating || 0);
  }, 0);
  const averageRating = totalRating / allComments.length;
  const roundedRating = Math.round(averageRating * 10) / 10;

  await Restaurant.findByIdAndUpdate(restaurantId, { rating: roundedRating });
  return roundedRating;
}

async function addComment(restaurantId, commentData) {
  const newComment = await Comment.create({
    ...commentData,
    restaurant: restaurantId,
  });

  const updatedRating = await updateRestaurantRating(restaurantId);

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
    $push: { comments: newComment._id },
  });

  if (!updatedRestaurant) {
    throw new Error("Не удалось обновить данные ресторана");
  }

  await newComment.populate("author");

  return {
    comment: newComment,
    newRating: updatedRating,
  };
}

async function deleteComment(restaurantId, commentId) {
  const deleteResult = await Comment.deleteOne({ _id: commentId });

  if (deleteResult.deletedCount === 0) {
    throw new Error("Комментарий не найден");
  }

  await Restaurant.findByIdAndUpdate(restaurantId, {
    $pull: { comments: commentId },
  });

  return await updateRestaurantRating(restaurantId);
}

module.exports = {
  addComment,
  deleteComment,
};
