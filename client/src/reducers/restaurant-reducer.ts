import { ACTION_TYPE } from '../actions';

const initialRestaurantState = {
	id: '',
	name: '',
	rating: 0,
	images: [],
	address: '',
	workingHours: '',
	cuisine: '',
	description: '',
	tables: [],
	comments: [],
	createdAt: '',
};

export const restaurantReducer = (state = initialRestaurantState, action) => {
	switch (action.type) {
		case ACTION_TYPE.ADD_COMMENT:
			return {
				...state,
				comments: [action.payload, ...state.comments],
			};
		case ACTION_TYPE.REMOVE_COMMENT:
			return {
				...state,
				comments: state.comments.filter(
					(comment) => comment.id !== action.payload,
				),
			};
		case ACTION_TYPE.SET_RESTAURANT_DATA:
			return {
				...state,
				...action.payload,
			};
		case ACTION_TYPE.RESET_RESTAURANT_DATA:
			return initialRestaurantState;
		default:
			return state;
	}
};
