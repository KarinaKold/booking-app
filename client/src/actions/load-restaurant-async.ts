import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { setRestaurantData } from './set-restaurant-data';
import { ACTION_TYPE } from './action-type';
import type { RestaurantData } from '../pages/HomePage/types';

export const loadRestaurantAsync =
	(restaurantId: string) => async (dispatch: Dispatch) => {
		dispatch({ type: ACTION_TYPE.SET_RESTAURANT_REQUEST });
		try {
			const response = await request<RestaurantData>(
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
				return { error: response.error };
			}
			return response;
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Ошибка сервера';
			dispatch({ type: ACTION_TYPE.SET_RESTAURANT_FAILURE, payload: errorMessage });
			return { data: null, error: errorMessage };
		}
	};
