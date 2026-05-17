import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './use-app-dispatch';
import {
	selectFavoriteRestaurants,
	selectOwnedRestaurants,
	selectProfileError,
	selectProfileLoading,
	selectUserBookings,
	selectUserFavorites,
	selectUserRole,
} from '../selectors';
import {
	loadFavoriteRestaurantsAsync,
	loadProfileDataAsync,
	removeBookingAsync,
	updateFavoritesAsync,
} from '../actions';
import { checkAccess } from '../utils';
import { ROLE } from '../constants';
import type { Booking, Restaurant } from '../types';
import type { ConfirmationParams } from '../providers';
import type { TFunction } from 'i18next';

export const useProfileData = (
	getConfirmation: (params: ConfirmationParams) => Promise<boolean>,
	t: TFunction,
) => {
	const dispatch = useAppDispatch();
	const roleId = useAppSelector(selectUserRole);
	const userFavorites = useAppSelector(selectUserFavorites);
	const bookings = useAppSelector<Booking[]>(selectUserBookings);
	const favoriteRestaurants = useAppSelector<Restaurant[]>(selectFavoriteRestaurants);
	const ownedRestaurants = useAppSelector<Restaurant[]>(selectOwnedRestaurants);
	const loading = useAppSelector<boolean>(selectProfileLoading);
	const error = useAppSelector<string | null>(selectProfileError);

	const isGuest = checkAccess([ROLE.GUEST], roleId);
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);
	const isModerator = checkAccess([ROLE.MODERATOR], roleId);

	const loadData = useCallback(async () => {
		if (isGuest) return;
		await dispatch(loadProfileDataAsync(roleId));
	}, [dispatch, isGuest, roleId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleCancel = async (id: string): Promise<void> => {
		const confirmed = await getConfirmation({
			title: t('common.confirm_cancel_title'),
			description: t('common.confirm_cancel_desc'),
			confirmText: t('common.yes'),
			closeText: t('common.no'),
		});

		if (confirmed) {
			await dispatch(removeBookingAsync(id));
		}
	};

	const handleFavorite = async (id: string | undefined): Promise<void> => {
		if (!id) return;

		const res = await dispatch(updateFavoritesAsync(id));
		if (res?.error) return;

		await dispatch(loadFavoriteRestaurantsAsync());
	};

	return {
		loading,
		error,
		bookings,
		favoriteRestaurants,
		ownedRestaurants,
		isAdmin,
		isGuest,
		isModerator,
		handleCancel,
		handleFavorite,
		userFavorites,
	};
};
