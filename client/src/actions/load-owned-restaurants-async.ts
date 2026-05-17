import type { AppThunk } from '../store';
import type { Restaurant, ServerResponse } from '../types';
import { request } from '../utils';
import { ACTION_TYPE } from './action-type';

export const loadOwnedRestaurantsAsync =
	(): AppThunk<ServerResponse<Restaurant[]>> => async (dispatch) => {
		try {
			const response =
				await request<ServerResponse<Restaurant[]>>('/restaurants/my');
			dispatch({
				type: ACTION_TYPE.FETCH_OWNED_SUCCESS,
				payload: response.data || [],
			});
			return { data: response.data || [], error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось загрузить заведения';
			return { data: null, error: errorMessage };
		}
	};
