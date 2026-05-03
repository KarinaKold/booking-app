import type { Dispatch } from 'redux';
import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';

export const loadUsersAsync =
	(
		search: string,
		page: number,
		limit: number,
		sortBy = 'registeredAt',
		sortOrder = 'desc',
	) =>
	async (dispatch: Dispatch) => {
		dispatch({ type: ACTION_TYPE.FETCH_USERS_REQUEST });
		try {
			const [usersResponse, rolesResponse] = await Promise.all([
				request(
					`/users?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
				),
				request('/users/roles'),
			]);

			if (usersResponse.error || rolesResponse.error) {
				const errorMessage = usersResponse.error || rolesResponse.error;
				dispatch({
					type: ACTION_TYPE.FETCH_USERS_FAILURE,
					payload: errorMessage,
				});
				return { error: errorMessage };
			}

			dispatch({
				type: ACTION_TYPE.FETCH_USERS_SUCCESS,
				payload: {
					users: usersResponse.data.users,
					roles: rolesResponse.data,
					lastPage: usersResponse.data.lastPage,
				},
			});
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			dispatch({
				type: ACTION_TYPE.FETCH_USERS_FAILURE,
				payload: errorMessage || 'Ошибка при загрузке данных',
			});
		}
	};
