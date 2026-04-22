import { request } from '../utils/request';
import { removeComment } from './remove-comment';

export const removeCommentAsync = (restaurantId, id) => (dispatch) => {
	request(`/restaurants/${restaurantId}/comments/${id}`, 'DELETE').then(() => {
		dispatch(removeComment(id));
	});
};
