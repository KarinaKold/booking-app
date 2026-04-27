import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { updateFavorites } from './update-favorites';
interface ServerResponse<T> {
	data: T | null;
	error: string | null;
}

export const updateFavoritesAsync =
	(restaurantId: string) =>
	async (dispatch: Dispatch): Promise<ServerResponse<string[]>> => {
		try {
			const response = (await request<string[]>(
				`/users/favorites/${restaurantId}`,
				'PATCH',
			)) as unknown as ServerResponse<string[]>;
			if (response.data) {
				dispatch(updateFavorites(response.data));
			}
			if (response.error) {
				console.error('Ошибка при обновлении избранного:', response.error);
			}
			return response;
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось обновить избранное';
			return {
				data: null,
				error: errorMessage,
			};
		}
	};
