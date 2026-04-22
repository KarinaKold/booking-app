import { request } from '../utils/request';

export const removeBookingAsync = (id) => (dispatch) => {
	return request(`/bookings/${id}`, 'DELETE').then((res) => {
		if (!res.error) {
			return res;
		}
	});
};
