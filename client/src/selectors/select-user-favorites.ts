import type { RootState } from '../store';

export const selectUserFavorites = (state: RootState) => state.user.favorites || [];
