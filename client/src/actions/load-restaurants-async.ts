import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';
import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';
import type { FetchSuccessPayload } from '../reducers';

export const loadRestaurantsAsync =
	(
		params: Record<string, string | number>,
	): AppThunk<ServerResponse<FetchSuccessPayload>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.FETCH_RESTAURANTS_REQUEST });
		try {
			const queryParams = new URLSearchParams(
				params as Record<string, string>,
			).toString();

			const response = await request<ServerResponse<FetchSuccessPayload>>(
				`/restaurants?${queryParams}`,
			);

			if (response.error) {
				dispatch({
					type: ACTION_TYPE.FETCH_RESTAURANTS_FAILURE,
					payload: response.error,
				});
				return { data: null, error: response.error };
			}

			const data: FetchSuccessPayload = {
				restaurants: response.data?.restaurants || [],
				lastPage: response.data?.lastPage || 1,
			};

			dispatch({
				type: ACTION_TYPE.FETCH_RESTAURANTS_SUCCESS,
				payload: data,
			});
			return { data: data, error: null };
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			dispatch({
				type: ACTION_TYPE.FETCH_RESTAURANTS_FAILURE,
				payload: errorMessage || 'Ошибка при загрузке данных',
			});
			return { data: null, error: errorMessage };
		}
	};
