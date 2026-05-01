import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const addCommentAsync =
	(restaurantId: string, { content, rating }: { content: string; rating: number }) =>
	async (dispatch: Dispatch) => {
		dispatch({ type: ACTION_TYPE.ADD_COMMENT_REQUEST });
		try {
			const response = await request<any>(
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
				return response;
			}

			dispatch({
				type: ACTION_TYPE.ADD_COMMENT_SUCCESS,
				payload: response.data,
			});

			return response;
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
