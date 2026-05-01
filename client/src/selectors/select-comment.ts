import type { RootState } from '../store';

export const selectCommentSubmitting = (state: RootState) =>
	state.restaurant.isSubmittingComment;
export const selectCommentError = (state: RootState) => state.restaurant.commentError;
