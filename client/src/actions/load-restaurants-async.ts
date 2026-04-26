import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const loadRestaurantsAsync =
	(params: Record<string, string | number>) => async (dispatch: Dispatch) => {
		dispatch({ type: ACTION_TYPE.FETCH_RESTAURANTS_REQUEST });
		try {
			const queryParams = new URLSearchParams(
				params as Record<string, string>,
			).toString();
			const response = await request(`/restaurants?${queryParams}`);

			if (response.error) {
				dispatch({
					type: ACTION_TYPE.FETCH_RESTAURANTS_FAILURE,
					payload: response.error,
				});
				return { error: response.error };
			}

			dispatch({
				type: ACTION_TYPE.FETCH_RESTAURANTS_SUCCESS,
				payload: response.data,
			});
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			dispatch({
				type: ACTION_TYPE.FETCH_RESTAURANTS_FAILURE,
				payload: errorMessage || 'Ошибка при загрузке данных',
			});
		}
	};
