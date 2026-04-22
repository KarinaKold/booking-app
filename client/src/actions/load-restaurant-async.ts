import { request } from '../utils/request';
import { setRestaurantData } from './set-restaurant-data';

export const loadRestaurantAsync = (restaurantId) => (dispatch) =>
	request(`/restaurants/${restaurantId}`).then((restaurantData) => {
		if (restaurantData.data) {
			dispatch(setRestaurantData(restaurantData.data));
		}

		return restaurantData;
	});
