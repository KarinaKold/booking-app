import type { Dispatch } from 'redux';
import { request, type ServerResponse } from '../utils/request';
import { setRestaurantData } from './set-restaurant-data';
import type { RestaurantData } from '../pages/HomePage/types';
import { ACTION_TYPE } from './action-type';

export const saveRestaurantAsync =
	(id: string | undefined, newRestaurantData: Partial<RestaurantData>) =>
	async (dispatch: Dispatch): Promise<ServerResponse<RestaurantData>> => {
		dispatch({ type: ACTION_TYPE.SET_RESTAURANT_REQUEST });
		try {
			const response = await request<RestaurantData>(
				id ? `/restaurants/${id}` : '/restaurants',
				id ? 'PATCH' : 'POST',
				newRestaurantData,
			);
			if (response.error) {
				dispatch({
					type: ACTION_TYPE.SET_RESTAURANT_FAILURE,
					payload: response.error,
				});
				return response;
			}
			if (response.data) {
				dispatch(setRestaurantData(response.data));
			}
			return response;
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ошибка при сохранении';
			dispatch({
				type: ACTION_TYPE.SET_RESTAURANT_FAILURE,
				payload: errorMessage,
			});

			return { data: null, error: errorMessage };
		}
	};
