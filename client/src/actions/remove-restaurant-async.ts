import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';
import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';

export const removeRestaurantAsync =
	(id: string): AppThunk<ServerResponse<boolean>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.SET_RESTAURANT_REQUEST });
		try {
			const response = await request<ServerResponse<boolean>>(
				`/restaurants/${id}`,
				'DELETE',
			);
			if (response.error) {
				dispatch({
					type: ACTION_TYPE.SET_RESTAURANT_FAILURE,
					payload: response.error,
				});
				return response;
			}
			dispatch({ type: ACTION_TYPE.RESET_RESTAURANT_DATA });
			return response;
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось удалить ресторан';
			dispatch({
				type: ACTION_TYPE.SET_RESTAURANT_FAILURE,
				payload: errorMessage,
			});
			return { data: null, error: errorMessage };
		}
	};
