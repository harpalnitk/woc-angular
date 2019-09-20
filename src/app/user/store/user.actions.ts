import {Action} from '@ngrx/store';
import {User} from '../../shared/models/user.model';


export enum UserActionTypes {
  LOAD_USER_ACTION = '[User] Load User Action',
  USER_LOADED_ACTION = '[User] User Loaded Action',
  LOAD_USER_PROFILE_ACTION = '[User] Load User Profile Action',
  USER_PROFILE_LOADED_ACTION = '[User] User Profile Loaded Action',
  EDIT_USER_PROFILE_ACTION = '[User] Edit User Profile Action',
  END_USER_PROFILE_EDIT_ACTION = '[User] End User Profile Edit',
  USER_PROFILE_FAIL_ACTION = '[User] User Profile Fail'
}


export class LoadUserAction implements Action {
  readonly type = UserActionTypes.LOAD_USER_ACTION;
  constructor(public payload: string) {}
}

export class UserLoadedAction implements Action {
  readonly type = UserActionTypes.USER_LOADED_ACTION;
  constructor(public payload: {user: User, redirect: boolean}) {}
}

export class LoadUserProfileAction implements Action {
  readonly type = UserActionTypes.LOAD_USER_PROFILE_ACTION;
}

export class UserProfileLoadedAction implements Action {
  readonly type = UserActionTypes.USER_PROFILE_LOADED_ACTION;
  constructor(public payload: {user: User, redirect: boolean}) {}
}

export class EndUserProfileEditAction implements Action {
  readonly type = UserActionTypes.END_USER_PROFILE_EDIT_ACTION;
  constructor(public payload?: User) {}
}

export class EditUserProfileAction implements Action {
  readonly type = UserActionTypes.EDIT_USER_PROFILE_ACTION;
  constructor(public payload?: User) {}
}

export class UserProfileFailAction implements Action {
  readonly type = UserActionTypes.USER_PROFILE_FAIL_ACTION;
  constructor(public payload: string) {}
}

export type UserActions =
  LoadUserAction |
  UserLoadedAction |
  LoadUserProfileAction |
  UserProfileLoadedAction |
  EndUserProfileEditAction |
  EditUserProfileAction |
  UserProfileFailAction;
