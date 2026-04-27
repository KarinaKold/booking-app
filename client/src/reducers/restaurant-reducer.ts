import { ACTION_TYPE } from '../actions';
import type { CommentData, RestaurantData } from '../pages/HomePage/types';

interface RestaurantState {
	data: RestaurantData;
	loading: boolean;
	error: string | null;
}

type RestaurantAction =
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_REQUEST }
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_SUCCESS; payload: RestaurantData }
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_FAILURE; payload: string }
	| { type: typeof ACTION_TYPE.ADD_COMMENT; payload: CommentData }
	| { type: typeof ACTION_TYPE.REMOVE_COMMENT; payload: string }
	| { type: typeof ACTION_TYPE.RESET_RESTAURANT_DATA };

const initialRestaurantState: RestaurantState = {
	data: {
		id: '',
		name: '',
		rating: 0,
		images: [],
		address: '',
		workingHours: '',
		cuisine: '',
		hasBarCard: false,
		description: '',
		tables: [],
		comments: [],
		owner: '',
		createdAt: '',
	},
	loading: false,
	error: null,
};

export const restaurantReducer = (
	state = initialRestaurantState,
	action: RestaurantAction,
): RestaurantState => {
	switch (action.type) {
		case ACTION_TYPE.SET_RESTAURANT_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case ACTION_TYPE.SET_RESTAURANT_SUCCESS:
			return {
				...state,
				data: action.payload,
				loading: false,
				error: null,
			};
		case ACTION_TYPE.SET_RESTAURANT_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case ACTION_TYPE.ADD_COMMENT:
			return {
				...state,
				data: {
					...state.data,
					comments: [action.payload, ...state.data.comments],
				},
			};
		case ACTION_TYPE.REMOVE_COMMENT:
			return {
				...state,
				data: {
					...state.data,
					comments: state.data.comments.filter(
						(comment) => comment.id !== action.payload,
					),
				},
			};
		case ACTION_TYPE.RESET_RESTAURANT_DATA:
			return initialRestaurantState;
		default:
			return state;
	}
};
