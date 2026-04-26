import type { RootState } from '../store';

export const selectUserId = (state: RootState) => state.user.id;
