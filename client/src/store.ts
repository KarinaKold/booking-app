import {
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore as createStore,
	type Action,
} from 'redux';
import { thunk, type ThunkAction, type ThunkDispatch } from 'redux-thunk';
import {
	appReducer,
	userReducer,
	usersReducer,
	restaurantReducer,
	restaurantsReducer,
} from './reducers';

const reducer = combineReducers({
	app: appReducer,
	user: userReducer,
	users: usersReducer,
	restaurant: restaurantReducer,
	restaurants: restaurantsReducer,
});

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
export type AppThunk<ReturnType = void> = ThunkAction<
	Promise<ReturnType>,
	RootState,
	unknown,
	Action<string>
>;
