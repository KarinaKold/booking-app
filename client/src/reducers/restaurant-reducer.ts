import { ACTION_TYPE } from '../actions';
import type { CommentData, RestaurantData } from '../pages/HomePage/types';

interface RestaurantState {
	data: RestaurantData;
	loading: boolean;
	error: string | null;
	isSubmittingComment: boolean;
	commentError: string | null;
}

type RestaurantAction =
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_REQUEST }
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_SUCCESS; payload: RestaurantData }
	| { type: typeof ACTION_TYPE.SET_RESTAURANT_FAILURE; payload: string }
	| { type: typeof ACTION_TYPE.ADD_COMMENT_REQUEST }
	| { type: typeof ACTION_TYPE.ADD_COMMENT_SUCCESS; payload: CommentData }
	| { type: typeof ACTION_TYPE.ADD_COMMENT_FAILURE; payload: string }
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
	isSubmittingComment: false,
	commentError: null,
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
		case ACTION_TYPE.ADD_COMMENT_REQUEST:
			return {
				...state,
				isSubmittingComment: true,
				commentError: null,
			};
		case ACTION_TYPE.ADD_COMMENT_SUCCESS:
			return {
				...state,
				isSubmittingComment: false,
				data: {
					...state.data,
					comments: [action.payload.comment, ...state.data.comments],
					rating: action.payload.updatedRating,
				},
			};
		case ACTION_TYPE.ADD_COMMENT_FAILURE:
			return {
				...state,
				isSubmittingComment: false,
				commentError: action.payload,
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
