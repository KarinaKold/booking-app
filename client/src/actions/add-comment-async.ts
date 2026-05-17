import type { CommentData } from '../pages/HomePage/types';
import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

interface AddCommentServerData {
	comment: CommentData;
	updatedRating: number;
}

export const addCommentAsync =
	(
		restaurantId: string,
		{ content, rating }: { content: string; rating: number },
	): AppThunk<ServerResponse<boolean>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.ADD_COMMENT_REQUEST });
		try {
			const response = await request<ServerResponse<AddCommentServerData>>(
				`/restaurants/${restaurantId}/comments`,
				'POST',
				{
					content,
					rating,
				},
			);

			if (response.error) {
				dispatch({
					type: ACTION_TYPE.ADD_COMMENT_FAILURE,
					payload: response.error,
				});
				return { data: null, error: response.error };
			}

			dispatch({
				type: ACTION_TYPE.ADD_COMMENT_SUCCESS,
				payload: response.data,
			});
			return { data: true, error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ошибка при отправке комментария';
			dispatch({
				type: ACTION_TYPE.ADD_COMMENT_FAILURE,
				payload: errorMessage,
			});
			return { data: null, error: errorMessage };
		}
	};
