import type { RestaurantData } from '../pages/HomePage/types';
import { ACTION_TYPE } from './action-type';

export const setRestaurantData = (restaurantData: RestaurantData) => ({
	type: ACTION_TYPE.SET_RESTAURANT_SUCCESS,
	payload: restaurantData,
});
