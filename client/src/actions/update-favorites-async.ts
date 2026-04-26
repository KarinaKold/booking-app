import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { updateFavorites } from './update-favorites';

export const updateFavoritesAsync = (restaurantId) => (dispatch: Dispatch) => {
	return request(`/users/favorites/${restaurantId}`, 'PATCH').then(
		(updatedFavorites) => {
			if (updatedFavorites.data) {
				dispatch(updateFavorites(updatedFavorites.data));
			}
			return updatedFavorites;
		},
	);
};
