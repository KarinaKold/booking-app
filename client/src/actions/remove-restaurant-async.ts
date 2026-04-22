import { request } from '../utils/request';

export const removeRestaurantAsync = (id) => () =>
	request(`/restaurants/${id}`, 'DELETE');
