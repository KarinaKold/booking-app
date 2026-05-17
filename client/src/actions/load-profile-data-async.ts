import { ROLE } from '../constants';
import type { AppThunk } from '../store';
import type { ServerResponse } from '../types';
import { checkAccess } from '../utils';
import { ACTION_TYPE } from './action-type';
import { loadBookingsAsync } from './load-booking-async';
import { loadFavoriteRestaurantsAsync } from './load-favorite-restaurants-async';
import { loadOwnedRestaurantsAsync } from './load-owned-restaurants-async';

export const loadProfileDataAsync =
	(roleId: number): AppThunk<ServerResponse<boolean>> =>
	async (dispatch) => {
		dispatch({ type: ACTION_TYPE.FETCH_PROFILE_REQUEST });

		try {
			const isAdmin = checkAccess([ROLE.ADMIN], roleId);
			const isModerator = checkAccess([ROLE.MODERATOR], roleId);
			const isOwner = isAdmin || isModerator;

			const tabs = [
				dispatch(loadBookingsAsync()),
				dispatch(loadFavoriteRestaurantsAsync()),
			];

			if (isOwner) {
				tabs.push(dispatch(loadOwnedRestaurantsAsync()));
			}

			await Promise.all(tabs);

			dispatch({ type: ACTION_TYPE.FETCH_PROFILE_SUCCESS });
			return { data: true, error: null };
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : 'Ошибка загрузки профиля';
			dispatch({ type: ACTION_TYPE.FETCH_PROFILE_FAILURE, payload: errorMessage });
			return { data: null, error: errorMessage };
		}
	};
