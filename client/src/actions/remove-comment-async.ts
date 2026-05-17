import { request } from '../utils/request';
import { removeComment } from './remove-comment';
import type { ServerResponse } from '../types';
import type { AppThunk } from '../store';

interface RemoveCommentResponseData {
	updatedRating: number;
}

export const removeCommentAsync =
	(restaurantId: string, id: string): AppThunk<ServerResponse<boolean>> =>
	async (dispatch) => {
		try {
			const response = await request<ServerResponse<RemoveCommentResponseData>>(
				`/restaurants/${restaurantId}/comments/${id}`,
				'DELETE',
			);

			const newRating = response.data?.updatedRating ?? 0;

			dispatch(removeComment(id, newRating));
			return { data: true, error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось удалить комментарий';
			return { data: null, error: errorMessage };
		}
	};
