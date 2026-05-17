import type { AppThunk } from '../store';
import type { Restaurant, ServerResponse } from '../types';
import { request } from '../utils';
import { ACTION_TYPE } from './action-type';

export const loadFavoriteRestaurantsAsync =
	(): AppThunk<ServerResponse<Restaurant[]>> => async (dispatch) => {
		try {
			const response = await request<ServerResponse<Restaurant[]>>(
				'/restaurants/favorites-details',
			);
			dispatch({
				type: ACTION_TYPE.FETCH_FAVORITES_SUCCESS,
				payload: response.data || [],
			});
			return { data: response.data || [], error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось загрузить избранное';
			return { data: null, error: errorMessage };
		}
	};
