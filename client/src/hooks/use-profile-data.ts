import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './use-app-dispatch';
import { selectUserFavorites, selectUserRole } from '../selectors';
import { updateFavoritesAsync } from '../actions';
import { checkAccess, request } from '../utils';
import { ROLE } from '../constants';
import type { Booking, Restaurant } from '../types';

interface ServerResponse<T> {
	data: T | null;
	error: string | null;
}

export const useProfileData = (getConfirmation: any, t: any) => {
	const dispatch = useAppDispatch();
	const roleId = useAppSelector(selectUserRole);
	const userFavorites = useAppSelector(selectUserFavorites);

	const [bookings, setBookings] = useState<Booking[]>([]);
	const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
	const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
	const [loading, setLoading] = useState(true);

	const isGuest = checkAccess([ROLE.GUEST], roleId);
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);
	const isModerator = checkAccess([ROLE.MODERATOR], roleId);

	const loadData = useCallback(async () => {
		if (isGuest) return;

		setLoading(true);
		try {
			const isOwner = isAdmin || isModerator;
			const [bRes, fRes, oRes] = await Promise.all([
				request<ServerResponse<Booking[]>>('/bookings/user'),
				request<ServerResponse<Restaurant[]>>('/restaurants/favorites-details'),
				isOwner
					? request<ServerResponse<Restaurant[]>>('/restaurants/my')
					: Promise.resolve({ data: [], error: null }),
			]);
			setBookings(bRes.data || []);
			setFavoriteRestaurants(fRes.data || []);
			setOwnedRestaurants(oRes.data || []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}, [isAdmin, isGuest, isModerator]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleCancel = async (id: string) => {
		const confirmed = await getConfirmation({
			title: t('common.confirm_cancel_title'),
			description: t('common.confirm_cancel_desc'),
			confirmText: t('common.yes'),
			closeText: t('common.no'),
		});

		if (confirmed) {
			try {
				await request(`/bookings/${id}`, 'DELETE');
				setBookings((prev) => prev.filter((b) => b._id !== id));
			} catch (error) {
				console.error('Ошибка отмены бронирования:', error);
			}
		}
	};

	const handleFavorite = async (id: string | undefined) => {
		if (!id) return;

		const res = await (dispatch(updateFavoritesAsync(id)) as any);
		if (res?.error) return;

		const isCurrFavorite = userFavorites.includes(id);

		if (isCurrFavorite) {
			setFavoriteRestaurants((prev) => prev.filter((r) => (r.id || r._id) !== id));
		} else {
			const restaurantToAdd = ownedRestaurants.find((r) => (r.id || r._id) === id);

			if (restaurantToAdd) {
				setFavoriteRestaurants((prev) => [...prev, restaurantToAdd]);
			} else {
				const fRes = await request<ServerResponse<Restaurant[]>>(
					'/restaurants/favorites-details',
				);

				if (fRes.data) setFavoriteRestaurants(fRes.data);
			}
		}
	};

	return {
		bookings,
		favoriteRestaurants,
		ownedRestaurants,
		loading,
		isAdmin,
		isGuest,
		isModerator,
		handleCancel,
		handleFavorite,
		userFavorites,
	};
};
