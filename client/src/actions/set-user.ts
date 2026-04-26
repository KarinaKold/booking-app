import type { UserData } from '../types';
import { ACTION_TYPE } from './action-type';

export const setUser = (user: UserData) => ({
	type: ACTION_TYPE.SET_USER,
	payload: user,
});
