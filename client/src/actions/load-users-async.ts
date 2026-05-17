import { request } from '../utils/request';
import { ACTION_TYPE } from './action-type';
import type { AppThunk } from '../store';
import type { Role, ServerResponse } from '../types';
import type { FetchUsersSuccessPayload } from '../reducers';

type UsersData = Omit<FetchUsersSuccessPayload, 'roles'>;

export const loadUsersAsync =
	(
		search: string,
		page: number,
		limit: number,
		sortBy = 'registeredAt',
		sortOrder = 'desc',
	): AppThunk<ServerResponse<FetchUsersSuccessPayload>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.FETCH_USERS_REQUEST });
		try {
			const [usersResponse, rolesResponse] = await Promise.all([
				request<ServerResponse<UsersData>>(
					`/users?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
				),
				request<ServerResponse<Role[]>>('/users/roles'),
			]);

			if (usersResponse.error || rolesResponse.error) {
				const errorMessage = usersResponse.error || rolesResponse.error;
				dispatch({
					type: ACTION_TYPE.FETCH_USERS_FAILURE,
					payload: errorMessage,
				});
				return { data: null, error: errorMessage };
			}

			const usersData: FetchUsersSuccessPayload = {
				users: usersResponse.data?.users || [],
				roles: rolesResponse.data || [],
				lastPage: usersResponse.data?.lastPage || 1,
			};

			dispatch({
				type: ACTION_TYPE.FETCH_USERS_SUCCESS,
				payload: usersData,
			});
			return { data: usersData, error: null };
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
			dispatch({
				type: ACTION_TYPE.FETCH_USERS_FAILURE,
				payload: errorMessage || 'Ошибка при загрузке данных',
			});
			return { data: null, error: errorMessage };
		}
	};
