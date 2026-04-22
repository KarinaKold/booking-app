import { request } from '../utils/request';
import { setRestaurantData } from './set-restaurant-data';

export const saveRestaurantAsync = (id, newRestaurantData) => (dispatch) => {
	const saveRequest = id
		? request(`/restaurants/${id}`, 'PATCH', newRestaurantData)
		: request('/restaurants', 'POST', newRestaurantData);

	return saveRequest.then((updatedRestaurant) => {
		console.log('Payload from server:', updatedRestaurant);
		dispatch(setRestaurantData(updatedRestaurant.data));

		return updatedRestaurant.data;
	});
};
