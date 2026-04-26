import { applyMiddleware, combineReducers, compose, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';
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
const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, composeEnhacers(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
