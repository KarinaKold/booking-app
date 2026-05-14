import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const logout = () => async (dispatch: Dispatch) => {
	try {
		await request('/logout', 'POST');

		localStorage.removeItem('token');
		sessionStorage.removeItem('userData');

		dispatch({ type: ACTION_TYPE.LOGOUT });
	} catch (error) {
		console.error('Ошибка при выходе:', error);
	}
};
