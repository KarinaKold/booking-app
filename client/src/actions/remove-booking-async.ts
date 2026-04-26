import type { Dispatch } from 'redux';
import { request } from '../utils/request';

export const removeBookingAsync = (id) => (dispatch: Dispatch) => {
	return request(`/bookings/${id}`, 'DELETE').then((res) => {
		if (!res.error) {
			return res;
		}
	});
};
