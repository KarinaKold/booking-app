import { ACTION_TYPE } from './action-type';

export const updateFavorites = (favorites: string[]) => ({
	type: ACTION_TYPE.SET_USER_FAVORITES,
	payload: favorites,
});
