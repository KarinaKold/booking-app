import { request } from '../utils';
import { ACTION_TYPE } from './action-type';
import type { AppThunk } from '../store';
import type { Booking, ServerResponse } from '../types';

export const loadBookingsAsync =
	(): AppThunk<ServerResponse<Booking[]>> => async (dispatch) => {
		try {
			const response = await request<ServerResponse<Booking[]>>('/bookings/user');
			const bookingsData = response.data || [];
			dispatch({
				type: ACTION_TYPE.FETCH_BOOKINGS_SUCCESS,
				payload: bookingsData,
			});
			return { data: bookingsData, error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось загрузить бронирования';
			return { data: null, error: errorMessage };
		}
	};
