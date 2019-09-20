
import * as AuthActions from './auth.actions';
import {UserSummaryVM} from '../../shared/models/view-models/user-summary-vm.model';
import * as _ from 'lodash';

export interface State {
  user: UserSummaryVM;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AuthActionTypes.AUTHENTICATE_SUCCESS:
      const user = new UserSummaryVM(
        action.payload._id,
        action.payload.email,
        action.payload.roles,
        action.payload._token,
        new Date(action.payload._tokenExpirationDate),
        action.payload.alias,
        action.payload.avatar
      );
      return {
        ...state, user: user,
        authError: null,
        loading: false
      };
    case AuthActions.AuthActionTypes.LOGOUT_FINISH:
      return {
        ...state, user: null
      };
    case AuthActions.AuthActionTypes.LOGIN_START:
    case AuthActions.AuthActionTypes.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true
      };
    case AuthActions.AuthActionTypes.AUTHENTICATE_FAIL:
      return {
        ...state,
        authError: action.payload,
        user: null,
        loading: false
      };
    case AuthActions.AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };
    case AuthActions.AuthActionTypes.UPDATE_AUTH_USER:
      return handleUpdateAuthUserAction(state, action);
    default:
      return state;
  }
}

// any action dispatched always reaches all reducers
// when ngrx starts one action is automatically dispatched
// for all reducers


export const getIsAuth = (state: State) => !!state.user;
export const getAuthUser = (state: State) => state.user;
export const getAuthError = (state: State) => state.authError;
export const getAuthLoading = (state: State) => state.loading;

function handleUpdateAuthUserAction(state: State, action: AuthActions.UpdateAuthUserAction) {
  console.log('Inside handleUpdateAuthUserAction');
  const newState: State = {
    user: _.clone(state.user),
    authError: state.authError,
    loading: state.loading
  };

  if(action.payload) {
    newState.user = Object.assign(newState.user,action.payload);
  }

  return newState;
}
