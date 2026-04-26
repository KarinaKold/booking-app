import { ACTION_TYPE } from '../actions';
import type { Restaurant } from '../types';
interface RestaurantsState {
	items: Restaurant[];
	lastPage: number;
	loading: boolean;
	error: string | null;
}

const initialRestaurantsState: RestaurantsState = {
	items: [],
	lastPage: 1,
	loading: false,
	error: null,
};

interface FetchSuccessPayload {
	restaurants: Restaurant[];
	lastPage: number;
}

type RestaurantsAction =
	| { type: typeof ACTION_TYPE.FETCH_RESTAURANTS_REQUEST }
	| { type: typeof ACTION_TYPE.FETCH_RESTAURANTS_SUCCESS; payload: FetchSuccessPayload }
	| { type: typeof ACTION_TYPE.FETCH_RESTAURANTS_FAILURE; payload: string };


export const restaurantsReducer = (state = initialRestaurantsState, action: RestaurantsAction): RestaurantsState => {
	switch (action.type) {
		case ACTION_TYPE.FETCH_RESTAURANTS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case ACTION_TYPE.FETCH_RESTAURANTS_SUCCESS:
			return {
				...state,
				loading: false,
				items: action.payload.restaurants,
				lastPage: action.payload.lastPage,
			};
		case ACTION_TYPE.FETCH_RESTAURANTS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
