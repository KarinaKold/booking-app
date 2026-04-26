import type { RootState } from '../store';

export const selectUserLogin = (state: RootState) => state.user.login;
