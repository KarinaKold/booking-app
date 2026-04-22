const Comment = require("../models/Comment");
const Restaurant = require("../models/Restaurant");

const updateRestaurantRating = async (restaurantId) => {
  const allComments = await Comment.find({ restaurant: restaurantId });

  if (allComments.length === 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, { rating: 0 });
    return;
  }
  const totalRating = allComments.reduce((acc, comment) => {
    return acc + (comment.rating || 0);
  }, 0);
  const averageRating = totalRating / allComments.length;
  const roundedRating = Math.round(averageRating * 10) / 10;

  await Restaurant.findByIdAndUpdate(restaurantId, { rating: roundedRating });
};

async function addComment(restaurantId, commentData) {
  const newComment = await Comment.create({
    ...commentData,
    restaurant: restaurantId,
  });

  await Restaurant.findByIdAndUpdate(restaurantId, {
    $push: { comments: newComment._id },
  });
  await updateRestaurantRating(restaurantId);
  await newComment.populate("author");

  return newComment;
}

async function deleteComment(restaurantId, commentId) {
  await Comment.deleteOne({ _id: commentId });
  await Restaurant.findByIdAndUpdate(restaurantId, {
    $pull: { comments: commentId },
  });
  await updateRestaurantRating(restaurantId);
}

module.exports = {
  addComment,
  deleteComment,
};
