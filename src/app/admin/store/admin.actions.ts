import {Action} from '@ngrx/store';
import {User} from '../../shared/models/user.model';

export interface UsersData {
  users: User[];
  total_count: number;
}

export interface UsersListDisplayConstants {
  sort: string;
  order: string;
  page: number;
  limit: number;
  search: string;
}

export enum AdminActionTypes {
  ADMIN_LOAD_USER_LIST_ACTION = '[Admin] Load User List Action',
  ADMIN_USER_LIST_LOADED_ACTION = '[Admin] User List Loaded Action',
  ADMIN_START_ADD_USER_ACTION = '[Admin] Start Add User Action',
  ADMIN_END_ADD_USER_ACTION = '[Admin] End Add User Action',
  ADMIN_LOAD_USER_ACTION = '[Admin] Load User Action',
  ADMIN_EDIT_USER_ACTION = '[Admin] Edit User Action',
  ADMIN_USER_LOADED_ACTION = '[Admin] User Loaded Action',
  ADMIN_END_USER_EDIT_ACTION = '[Admin] End User Edit Action',
  ADMIN_DELETE_USER_ACTION = '[Admin] User Delete Action',
  ADMIN_END_DELETE_USER_ACTION = '[Admin] End Delete User Action',
  ADMIN_USER_FAIL_ACTION = '[Admin] User Fail Action'
}

export class AdminLoadUserListAction implements Action {
  readonly type = AdminActionTypes.ADMIN_LOAD_USER_LIST_ACTION;
  constructor(public payload: UsersListDisplayConstants) {}
}
export class AdminUserListLoadedAction implements Action {
  readonly type = AdminActionTypes.ADMIN_USER_LIST_LOADED_ACTION;
  constructor(public payload: UsersData) {}
}

export class AdminStartAddUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_START_ADD_USER_ACTION;
  constructor(public payload: any) {}
}

export class AdminEndAddUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_END_ADD_USER_ACTION;
  constructor(public payload?: User) {}
}

export class AdminLoadUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_LOAD_USER_ACTION;
  constructor(public payload: string) {}
}

export class AdminUserLoadedAction implements Action {
  readonly type = AdminActionTypes.ADMIN_USER_LOADED_ACTION;
  constructor(public payload: {user: User, redirect: boolean}) {}
}

export class AdminEndUserEditAction implements Action {
  readonly type = AdminActionTypes.ADMIN_END_USER_EDIT_ACTION;
  constructor(public payload?: User) {}
}

export class AdminEditUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_EDIT_USER_ACTION;
  constructor(public payload?: {id: string, formData: any}) {}
}

export class AdminDeleteUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_DELETE_USER_ACTION;
  constructor(public payload: string) {}
}

export class AdminEndDeleteUserAction implements Action {
  readonly type = AdminActionTypes.ADMIN_END_DELETE_USER_ACTION;
  constructor(public payload: string) {}
}

export class AdminUserFailAction implements Action {
  readonly type = AdminActionTypes.ADMIN_USER_FAIL_ACTION;
  constructor(public payload: string) {}
}

export type AdminActions =
  AdminLoadUserListAction |
  AdminUserListLoadedAction |
  AdminStartAddUserAction |
  AdminEndAddUserAction |
  AdminLoadUserAction |
  AdminUserLoadedAction |
  AdminEndUserEditAction |
  AdminEditUserAction |
  AdminDeleteUserAction |
  AdminEndDeleteUserAction |
  AdminUserFailAction;
