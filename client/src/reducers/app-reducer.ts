import { ACTION_TYPE } from '../actions';
interface AppState {
	wasLogout: boolean;
}

const initialAppState: AppState = {
	wasLogout: false,
};

type AppAction = {
	type: typeof ACTION_TYPE.LOGOUT;
};

export const appReducer = (state = initialAppState, action: AppAction) => {
	switch (action.type) {
		case ACTION_TYPE.LOGOUT:
			return {
				...state,
				wasLogout: !state.wasLogout,
			};
		default:
			return state;
	}
};
