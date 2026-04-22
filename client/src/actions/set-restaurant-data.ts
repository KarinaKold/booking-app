import { ACTION_TYPE } from './action-type';

export const setRestaurantData = (restaurantData) => ({
	type: ACTION_TYPE.SET_RESTAURANT_DATA,
	payload: restaurantData,
});
