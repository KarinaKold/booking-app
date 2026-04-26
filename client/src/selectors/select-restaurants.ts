import type { RootState } from '../store';

export const selectRestaurants = (state: RootState) => state.restaurants.items;
export const selectRestaurantsLoading = (state: RootState) => state.restaurants.loading;
export const selectRestaurantsError = (state: RootState) => state.restaurants.error;
export const selectLastPage = (state: RootState) => state.restaurants.lastPage;
