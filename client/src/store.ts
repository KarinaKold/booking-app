import {
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore as createStore,
	type Action,
	type Reducer,
	type StoreEnhancer,
} from 'redux';
import { thunk, type ThunkAction, type ThunkDispatch } from 'redux-thunk';
import {
	appReducer,
	userReducer,
	usersReducer,
	restaurantReducer,
	restaurantsReducer,
} from './reducers';

import type { AppAction } from './reducers/app-reducer';
import type { UserAction } from './reducers/user-reducer';
import type { UsersAction } from './reducers/users-reducer';
import type { RestaurantAction } from './reducers/restaurant-reducer';
import type { RestaurantsAction } from './reducers/restaurants-reducer';

const reducer = combineReducers({
	app: appReducer,
	user: userReducer,
	users: usersReducer,
	restaurant: restaurantReducer,
	restaurants: restaurantsReducer,
});
export type RootState = ReturnType<typeof reducer>;

export type AnyAppAction =
	| AppAction
	| UserAction
	| UsersAction
	| RestaurantAction
	| RestaurantsAction;

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
	reducer as unknown as Reducer<RootState, AnyAppAction>,
	composeEnhancers(applyMiddleware(thunk)) as StoreEnhancer,
);

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAppAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
	Promise<ReturnType>,
	RootState,
	unknown,
	Action<string>
>;
