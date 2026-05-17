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
	// const [bookings, setBookings] = useState<Booking[]>([]);

	// const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
	// const [ownedRestaurants, setOwnedRestaurants] = useState<Restaurant[]>([]);
	// const [loading, setLoading] = useState(true);

	const isGuest = checkAccess([ROLE.GUEST], roleId);
	const isAdmin = checkAccess([ROLE.ADMIN], roleId);
	const isModerator = checkAccess([ROLE.MODERATOR], roleId);

	const loadData = useCallback(async () => {
		if (isGuest) return;
		await dispatch(loadProfileDataAsync(roleId));
	}, [dispatch, isGuest, roleId]);

	// setLoading(true);
	// try {
	// 	const isOwner = isAdmin || isModerator;

	// const [, fRes, oRes] = await Promise.all([
	// request<ServerResponse<Booking[]>>('/bookings/user'),
	// request<ServerResponse<Restaurant[]>>('/restaurants/favorites-details'),
	// 	isOwner
	// 		? request<ServerResponse<Restaurant[]>>('/restaurants/my')
	// 		: Promise.resolve({ data: [], error: null }),
	// ]);
	// setBookings(bRes.data || []);
	// dispatch({ type: ACTION_TYPE.SET_USER_BOOKINGS, payload: bRes.data || [] });
	// setFavoriteRestaurants(fRes.data || []);
	// setOwnedRestaurants(oRes.data || []);
	// 	} catch (e) {
	// 		console.error(e);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }, [dispatch, isAdmin, isGuest, isModerator]);

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
			// try {
			// 	await request(`/bookings/${id}`, 'DELETE');
			// 	setBookings((prev) => prev.filter((b) => b._id !== id));
			// } catch (error) {
			// 	console.error('Ошибка отмены бронирования:', error);
			// }
		}
	};

	const handleFavorite = async (id: string | undefined): Promise<void> => {
		if (!id) return;

		const res = await dispatch(updateFavoritesAsync(id));
		if (res?.error) return;

		// const isCurrFavorite = userFavorites.includes(id);
		await dispatch(loadFavoriteRestaurantsAsync());
		// if (isCurrFavorite) {
		// 	setFavoriteRestaurants((prev) => prev.filter((r) => (r.id || r._id) !== id));
		// } else {
		// 	const restaurantToAdd = ownedRestaurants.find((r) => (r.id || r._id) === id);

		// 	if (restaurantToAdd) {
		// 		setFavoriteRestaurants((prev) => [...prev, restaurantToAdd]);
		// 	} else {
		// 		const fRes = await request<ServerResponse<Restaurant[]>>(
		// 			'/restaurants/favorites-details',
		// 		);

		// 		if (fRes.data) setFavoriteRestaurants(fRes.data);
		// 	}
		// }
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
