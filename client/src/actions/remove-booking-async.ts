import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const removeBookingAsync =
	(id: string): AppThunk<ServerResponse<boolean>> =>
	async (dispatch) => {
		try {
			await request<ServerResponse<boolean>>(`/bookings/${id}`, 'DELETE');
			dispatch({
				type: ACTION_TYPE.REMOVE_BOOKING,
				payload: id,
			});
			return { data: true, error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Не удалось отменить бронирование';
			return { data: null, error: errorMessage };
		}
	};
