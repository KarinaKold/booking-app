import type { RootState } from '../store';

export const selectRestaurant = (state: RootState) => state.restaurant.data;
export const selectRestaurantLoading = (state: RootState) => state.restaurant.loading;
export const selectRestaurantError = (state: RootState) => state.restaurant.error;
