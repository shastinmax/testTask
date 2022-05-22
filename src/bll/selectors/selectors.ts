import { RootStateType } from '../store';
// users
export const selectPage = (state: RootStateType) => state.users.params.page;
export const selectCount = (state: RootStateType) => state.users.params.count;
export const selectUsers = (state: RootStateType) => state.users.users;
export const selectTotalPages = (state: RootStateType) => state.users.total_pages;
export const selectIsRedirect = (state: RootStateType) => state.users.isRedirectValue;
export const selectLoading = (state: RootStateType) => state.users.loading;
// form
export const selectPositions = (state: RootStateType) => state.form.positions;
