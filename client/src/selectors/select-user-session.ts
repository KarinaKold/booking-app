import type { RootState } from '../store';

export const selectUserSession = (state: RootState) => state.user.session;
