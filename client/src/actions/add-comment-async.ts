import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { addComment } from './add-comment';
import { loadRestaurantAsync } from './load-restaurant-async';

export const addCommentAsync =
	(restaurantId, { content, rating }) =>
	(dispatch: Dispatch) => {
		request(`/restaurants/${restaurantId}/comments`, 'POST', {
			content,
			rating,
		}).then((comment) => {
			dispatch(addComment(comment.data));
			dispatch(loadRestaurantAsync(restaurantId));
		});
	};
