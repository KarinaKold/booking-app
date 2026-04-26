import type { RootState } from '../store';

export const selectUserRole = (state: RootState) => state.user.roleId;
