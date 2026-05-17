import { ACTION_TYPE } from '../actions';
import { ROLE } from '../constants';
import type { Booking, Restaurant } from '../types';

export interface UserState {
	id: string | null;
	login: string | null;
	roleId: number;
	session: string | null;
	favorites: string[];
	bookings: Booking[];
	favoriteRestaurants: Restaurant[];
	ownedRestaurants: Restaurant[];
	loading: boolean;
	error: string | null;
}

const initialUserState: UserState = {
	id: null,
	login: null,
	roleId: ROLE.GUEST,
	session: null,
	favorites: [],
	bookings: [],
	favoriteRestaurants: [],
	ownedRestaurants: [],
	loading: false,
	error: null,
};

export type UserAction =
	| { type: typeof ACTION_TYPE.SET_USER; payload: Partial<UserState> }
	| { type: typeof ACTION_TYPE.SET_USER_FAVORITES; payload: string[] }
	| { type: typeof ACTION_TYPE.FETCH_PROFILE_REQUEST }
	| { type: typeof ACTION_TYPE.FETCH_PROFILE_SUCCESS }
	| { type: typeof ACTION_TYPE.FETCH_PROFILE_FAILURE; payload: string }
	| { type: typeof ACTION_TYPE.FETCH_BOOKINGS_SUCCESS; payload: Booking[] }
	| { type: typeof ACTION_TYPE.FETCH_FAVORITES_SUCCESS; payload: Restaurant[] }
	| { type: typeof ACTION_TYPE.FETCH_OWNED_SUCCESS; payload: Restaurant[] }
	| { type: typeof ACTION_TYPE.REMOVE_BOOKING; payload: string }
	| { type: typeof ACTION_TYPE.LOGOUT };

export const userReducer = (state = initialUserState, action: UserAction): UserState => {
	switch (action.type) {
		case ACTION_TYPE.SET_USER:
			return {
				...state,
				...action.payload,
			};
		case ACTION_TYPE.SET_USER_FAVORITES:
			return {
				...state,
				favorites: action.payload,
			};
		case ACTION_TYPE.FETCH_PROFILE_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case ACTION_TYPE.FETCH_PROFILE_SUCCESS:
			return {
				...state,
				loading: false,
			};
		case ACTION_TYPE.FETCH_PROFILE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case ACTION_TYPE.FETCH_BOOKINGS_SUCCESS:
			return {
				...state,
				bookings: action.payload,
			};
		case ACTION_TYPE.FETCH_FAVORITES_SUCCESS:
			return {
				...state,
				favoriteRestaurants: action.payload,
			};
		case ACTION_TYPE.FETCH_OWNED_SUCCESS:
			return {
				...state,
				ownedRestaurants: action.payload,
			};

		case ACTION_TYPE.REMOVE_BOOKING:
			return {
				...state,
				bookings: state.bookings.filter((b) => b._id !== action.payload),
			};
		case ACTION_TYPE.LOGOUT:
			return initialUserState;
		default:
			return state;
	}
};
