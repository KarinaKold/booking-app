import { ACTION_TYPE } from './action-type';

export interface RemoveCommentAction {
	type: typeof ACTION_TYPE.REMOVE_COMMENT;
	payload: {
		commentId: string;
		updatedRating: number;
	};
}

export const removeComment = (
	commentId: string,
	updatedRating: number,
): RemoveCommentAction => ({
	type: ACTION_TYPE.REMOVE_COMMENT,
	payload: { commentId, updatedRating },
});
