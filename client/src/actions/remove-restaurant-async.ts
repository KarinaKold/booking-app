import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const removeRestaurantAsync = (id: string) => async (dispatch: Dispatch) => {
	dispatch({ type: ACTION_TYPE.SET_RESTAURANT_REQUEST });
	try {
		const response = await request<unknown>(`/restaurants/${id}`, 'DELETE');
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
