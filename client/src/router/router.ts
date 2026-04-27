import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import {
	AuthPage,
	HomePage,
	NotFoundPage,
	ProfilePage,
	RegPage,
	RestaurantPage,
	UsersPage,
} from '../pages';

export const router = createBrowserRouter([
	{
		path: '/',
		Component: App,
		children: [
			{ index: true, Component: HomePage },
			{ path: 'login', Component: AuthPage },
			{ path: 'register', Component: RegPage },
			{ path: 'users', Component: UsersPage },
			{ path: 'profile', Component: ProfilePage },
			{ path: 'rest', Component: RestaurantPage },
			{ path: 'rest/:id', Component: RestaurantPage },
			{ path: 'rest/:id/edit', Component: RestaurantPage },
			{
				path: '*',
				Component: NotFoundPage,
			},
		],
	},
]);
