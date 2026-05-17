import type { RootState } from '../store';
import type { Booking, Restaurant } from '../types';

export const selectUserBookings = (state: RootState): Booking[] => state.user.bookings;
export const selectFavoriteRestaurants = (state: RootState): Restaurant[] =>
	state.user.favoriteRestaurants;
export const selectOwnedRestaurants = (state: RootState): Restaurant[] =>
	state.user.ownedRestaurants;
export const selectProfileLoading = (state: RootState): boolean => state.user.loading;
export const selectProfileError = (state: RootState): string | null => state.user.error;
