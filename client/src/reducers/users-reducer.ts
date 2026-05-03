import { ACTION_TYPE } from '../actions';

const initialUsersDataState = {
	users: [],
	roles: [],
	loading: false,
	error: null,
	lastPage: 1,
};

export const usersReducer = (state = initialUsersDataState, action) => {
	const { type, payload } = action;

	switch (type) {
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
				users: payload.users,
				roles: payload.roles,
				lastPage: payload.lastPage,
			};
		case ACTION_TYPE.FETCH_USERS_FAILURE:
			return {
				...state,
				loading: false,
				error: payload,
			};
		default:
			return state;
	}
};
