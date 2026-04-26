import { ACTION_TYPE } from '../actions';
import { ROLE } from '../constants';

export interface UserState {
	id: string | null;
	login: string | null;
	roleId: number;
	session: string | null;
	favorites: string[];
}

const initialUserState = {
	id: null,
	login: null,
	roleId: ROLE.GUEST,
	session: null,
	favorites: [],
};

type UserAction =
	| { type: typeof ACTION_TYPE.SET_USER; payload: Partial<UserState> }
	| { type: typeof ACTION_TYPE.SET_USER_FAVORITES; payload: string[] }
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
		case ACTION_TYPE.LOGOUT:
			return initialUserState;
		default:
			return state;
	}
};
