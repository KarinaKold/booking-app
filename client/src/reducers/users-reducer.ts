import { ACTION_TYPE } from '../actions';
import type { Role, UserData } from '../types';

export interface UsersDataState {
	users: UserData[];
	roles: Role[];
	loading: boolean;
	error: string | null;
	lastPage: number;
}

const initialUsersDataState: UsersDataState = {
	users: [],
	roles: [],
	loading: false,
	error: null,
	lastPage: 1,
};

export interface FetchUsersSuccessPayload {
	users: UserData[];
	roles: Role[];
	lastPage: number;
}

type UsersAction =
	| { type: typeof ACTION_TYPE.FETCH_USERS_REQUEST }
	| { type: typeof ACTION_TYPE.FETCH_USERS_SUCCESS; payload: FetchUsersSuccessPayload }
	| { type: typeof ACTION_TYPE.FETCH_USERS_FAILURE; payload: string };

export const usersReducer = (
	state = initialUsersDataState,
	action: UsersAction,
): UsersDataState => {
	switch (action.type) {
		case ACTION_TYPE.FETCH_USERS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case ACTION_TYPE.FETCH_USERS_SUCCESS:
			return {
				...state,
				loading: false,
				users: action.payload.users,
				roles: action.payload.roles,
				lastPage: action.payload.lastPage,
			};
		case ACTION_TYPE.FETCH_USERS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
