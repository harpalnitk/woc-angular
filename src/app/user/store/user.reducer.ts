import * as fromRoot from '../../app.reducer';
import {User} from '../../shared/models/user.model';
import * as UserAction from './user.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as _ from 'lodash';
// User module is lazily loaded
// so we cannot merge this reducer in app.reducer
// as it will load lot of training code ahead of time
export interface UserState {
  userProfile: User;
  viewUser: User;
  isLoading: boolean;
}

// User state knows about app state but app state
// does not know about training state
// behind the scene ngrx will merge user state with app state
// whenever the module is loaded, by few instructions
export interface State extends fromRoot.AppState {
  user: UserState;
}

const initialState: UserState = {
  userProfile: null,
  viewUser: null,
  isLoading: false
};

export function userReducer(state = initialState, action: UserAction.UserActions) {
switch (action.type) {
  case UserAction.UserActionTypes.LOAD_USER_ACTION :
    return state;

  case UserAction.UserActionTypes.USER_LOADED_ACTION :
    console.log('User Loaded action:', action.payload);
    return handleUserLoadedAction(state, action);

  case UserAction.UserActionTypes.LOAD_USER_PROFILE_ACTION :
    return state;

  case UserAction.UserActionTypes.USER_PROFILE_LOADED_ACTION :
    console.log('User Profile Loaded action:', action.payload);
    return handleUserProfileLoadedAction(state, action);

  case UserAction.UserActionTypes.EDIT_USER_PROFILE_ACTION :
    return {
      ...state, isLoading : true
    };

  case UserAction.UserActionTypes.END_USER_PROFILE_EDIT_ACTION :
    console.log('End User Edit:', action.payload);
    return {
      ...state, isLoading : false
    };

  case UserAction.UserActionTypes.USER_PROFILE_FAIL_ACTION :
    return {
      ...state, isLoading : false
    };

  default:
    return state;
}
}

export const getUserState = createFeatureSelector<UserState>('user');
export const getUserProfile
  = createSelector(getUserState, (state: UserState) => state.userProfile);
export const getViewUser
  = createSelector(getUserState, (state: UserState) => state.viewUser);
export const getUserIsLoading
  = createSelector(getUserState, (state: UserState) => state.isLoading);


function handleUserProfileLoadedAction(state: UserState, action: UserAction.UserProfileLoadedAction) {
  const newUiState : UserState = {
    userProfile: _.clone(state.userProfile),
    isLoading: state.isLoading,
    viewUser: state.viewUser
  }
 if(action.payload && action.payload.user){
   newUiState.userProfile = action.payload.user;
 }
  return newUiState;
}

function handleUserLoadedAction(state: UserState, action: UserAction.UserLoadedAction) {
  const newUiState : UserState = {
    userProfile: state.userProfile,
    isLoading: state.isLoading,
    viewUser: _.clone(state.viewUser)
  }
  if(action.payload && action.payload.user){
    newUiState.viewUser = action.payload.user;
  }
  return newUiState;
}
