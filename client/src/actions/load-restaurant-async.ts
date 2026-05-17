import { request } from '../utils/request';
import { setRestaurantData } from './set-restaurant-data';
import { ACTION_TYPE } from './action-type';
import type { RestaurantData } from '../pages/HomePage/types';
import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';

export const loadRestaurantAsync =
	(restaurantId: string): AppThunk<ServerResponse<RestaurantData>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.SET_RESTAURANT_REQUEST });
		try {
			const response = await request<ServerResponse<RestaurantData>>(
				`/restaurants/${restaurantId}`,
			);

			if (response.data) {
				dispatch(setRestaurantData(response.data));
			}

			if (response.error) {
				dispatch({
					type: ACTION_TYPE.SET_RESTAURANT_FAILURE,
					payload: response.error,
				});
				return { data: null, error: response.error };
			}

			return { data: response.data, error: null };
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Ошибка сервера';
			dispatch({ type: ACTION_TYPE.SET_RESTAURANT_FAILURE, payload: errorMessage });
			return { data: null, error: errorMessage };
		}
	};
