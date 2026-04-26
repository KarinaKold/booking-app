import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { removeComment } from './remove-comment';

export const removeCommentAsync = (restaurantId, id) => (dispatch: Dispatch) => {
	request(`/restaurants/${restaurantId}/comments/${id}`, 'DELETE').then(() => {
		dispatch(removeComment(id));
	});
};
