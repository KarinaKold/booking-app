import type { RootState } from '../store';

export const selectUsersData = (state: RootState) => state.users.users;
export const selectUsersRoles = (state: RootState) => state.users.roles;
export const selectUsersDataLastPage = (state: RootState) => state.users.lastPage;
export const selectUsersDataLoading = (state: RootState) => state.users.loading;
export const selectUsersDataError = (state: RootState) => state.users.error;
