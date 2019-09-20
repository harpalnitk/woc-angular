import {Action} from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN_START = '[Auth] LOGIN START',
  SIGNUP_START = '[Auth] SIGNUP_START',
  AUTHENTICATE_SUCCESS = '[Auth] AUTHENTICATE_SUCCESS',
  AUTHENTICATE_FAIL = '[Auth] AUTHENTICATE_FAIL',
  CLEAR_ERROR = '[Auth] CLEAR_ERROR',
  AUTO_LOGIN = '[Auth] AUTO_LOGIN',
  LOGOUT = '[Auth] LOGOUT',
  LOGOUT_ALL = '[Auth] LOGOUT_ALL',
  LOGOUT_FINISH = '[Auth] Logout Finish',
  UPDATE_AUTH_USER= '[Auth] Update Auth User'
}



export class LoginStartAction implements Action {
  readonly type = AuthActionTypes.LOGIN_START;
  constructor(public payload: {email: string, password: string}) {}
}
export class SignupStartAction implements Action {
  readonly type = AuthActionTypes.SIGNUP_START;
  constructor(public payload: {email: string, password: string}) {}
}

export class AuthenticateFailAction implements Action {
  readonly type = AuthActionTypes.AUTHENTICATE_FAIL;
  constructor(public payload: string) {}
}
export class AuthenticateSuccessAction implements Action {
  readonly type = AuthActionTypes.AUTHENTICATE_SUCCESS;
  constructor(public payload: {
    _id: string;
    email: string;
    roles: string [];
    _token: string;
    _tokenExpirationDate: string;
    alias?: string;
    avatar?: boolean;
    redirect: boolean;
  }) {}
}

export class ClearErrorAction implements Action {
  readonly type = AuthActionTypes.CLEAR_ERROR;
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class LogoutAllAction implements Action {
  readonly type = AuthActionTypes.LOGOUT_ALL;
}
export class LogoutFinishAction implements Action {
  readonly type = AuthActionTypes.LOGOUT_FINISH;
}
export class AutoLoginAction implements Action {
  readonly type = AuthActionTypes.AUTO_LOGIN;
}

export class UpdateAuthUserAction implements Action {
  readonly type = AuthActionTypes.UPDATE_AUTH_USER;
  constructor(public payload: {
    roles: string [];
    alias?: string;
    avatar?: boolean;
  }) {}
}

export type AuthActions =
  LoginStartAction |
  SignupStartAction |
  AuthenticateSuccessAction |
  AuthenticateFailAction |
  ClearErrorAction |
  AutoLoginAction |
  LogoutAction |
  LogoutAllAction |
  LogoutFinishAction |
  UpdateAuthUserAction;
