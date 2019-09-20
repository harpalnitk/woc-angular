import {User, UserConstants} from '../../shared/models/user.model';
import * as fromRoot from '../../app.reducer';
import * as AdminAction from './admin.actions';
import * as _ from 'lodash';
import {createFeatureSelector, createSelector} from '@ngrx/store';





export interface AdminState {
  userList: User[];
  currentUser: User;
  isLoading: boolean;
  displayConstants: AdminAction.UsersListDisplayConstants;
  userListCount: number;
}

// Admin state knows about app state but app state
// does not know about admin state
// behind the scene ngrx will merge admin state with app state
// whenever the module is loaded, by few instructions
export interface State extends fromRoot.AppState {
  admin: AdminState;
}

const initialState: AdminState = {
  userList: [],
  currentUser: null,
  isLoading: false,
  displayConstants: {sort: '_id', order: 'desc', page: 0, limit: 10, search: ''},
  userListCount: 0
};

export function adminReducer(state = initialState, action: AdminAction.AdminActions) {
  switch (action.type) {
    case AdminAction.AdminActionTypes.ADMIN_LOAD_USER_LIST_ACTION:
      return handleAdminLoadUserListAction(state, action);

    case AdminAction.AdminActionTypes.ADMIN_USER_LIST_LOADED_ACTION:
      console.log('Admin User List Loaded action:', action.payload);
      return handleAdminUserListLoadedAction(state, action);

    case AdminAction.AdminActionTypes.ADMIN_LOAD_USER_ACTION :
      return state;

    case AdminAction.AdminActionTypes.ADMIN_USER_LOADED_ACTION :
      console.log('Admin User Loaded action:', action.payload);
      return handleAdminUserLoadedAction(state, action);

      case AdminAction.AdminActionTypes.ADMIN_EDIT_USER_ACTION :
      return {
        ...state, isLoading : true
      };

    case AdminAction.AdminActionTypes.ADMIN_END_USER_EDIT_ACTION :
      console.log('Admin End User Edit:', action.payload);
      return {
        ...state, isLoading : false
      };
    case AdminAction.AdminActionTypes.ADMIN_DELETE_USER_ACTION :
      return {
        ...state, isLoading : true
      };

    case AdminAction.AdminActionTypes.ADMIN_END_DELETE_USER_ACTION :
      console.log('Admin End User Delete:', action.payload);
      return handleAdminUserDeletedAction(state, action);

    case AdminAction.AdminActionTypes.ADMIN_START_ADD_USER_ACTION :
      return {
        ...state, isLoading : true
      };

    case AdminAction.AdminActionTypes.ADMIN_END_ADD_USER_ACTION :
      console.log('Admin End User Add:', action.payload);
      return {
        ...state, isLoading : false
      };
    case AdminAction.AdminActionTypes.ADMIN_USER_FAIL_ACTION :
      return {
        ...state, isLoading : false
      };
    default:
      return state;
  }
}

export const getAdminState = createFeatureSelector<AdminState>('admin');
export const getCurrentUserInAdmin
  = createSelector(getAdminState, (state: AdminState) => state.currentUser);
export const getAdminIsLoadingState
  = createSelector(getAdminState, (state: AdminState) => state.isLoading);
export const getAdminUserListCount
  = createSelector(getAdminState, (state: AdminState) => state.userListCount);
export const getAdminUserList
  = createSelector(getAdminState, (state: AdminState) => state.userList);
export const getAdminDisplayConstants
  = createSelector(getAdminState, (state: AdminState) => state.displayConstants);


function handleAdminUserLoadedAction(state: AdminState, action: AdminAction.AdminUserLoadedAction) {
  const newUiState : AdminState = {
    currentUser: _.clone(state.currentUser),
    userList: state.userList,
    isLoading: state.isLoading,
    displayConstants: state.displayConstants,
    userListCount: state.userListCount
  };
  if(action.payload && action.payload.user){
    newUiState.currentUser = action.payload.user;
  }
  return newUiState;
}

function handleAdminLoadUserListAction(state: AdminState, action: AdminAction.AdminLoadUserListAction) {
  const newUiState : AdminState = {
    currentUser: state.currentUser,
    userList: state.userList,
    isLoading: true,
    displayConstants: _.clone(state.displayConstants),
    userListCount: state.userListCount
  };
  if(action.payload){
   newUiState.displayConstants = action.payload;
  }
  return newUiState;
}
function handleAdminUserListLoadedAction(state: AdminState, action: AdminAction.AdminUserListLoadedAction) {
  const newUiState : AdminState = {
    currentUser: state.currentUser,
    userList: _.cloneDeep(state.userList),
    isLoading: false,
    displayConstants: state.displayConstants,
    userListCount: state.userListCount
  };
  if(action.payload && action.payload.users){

    newUiState.userList = action.payload.users;
    newUiState.userListCount = action.payload.total_count;

  }
  return newUiState;
}

function handleAdminUserDeletedAction(state: AdminState, action: AdminAction.AdminEndDeleteUserAction) {
  console.log('Inside handleAdminUserDeletedAction')
  const newUiState : AdminState = {
    currentUser: state.currentUser,
    userList: _.cloneDeep(state.userList),
    isLoading: false,
    displayConstants: state.displayConstants,
    userListCount: state.userListCount
  };
  if(action.payload){
    console.log('Inside handleAdminUserDeletedAction', action.payload);
    newUiState.userList = newUiState.userList.filter((user) => {
      return user._id !== action.payload
    });
    newUiState.userListCount = newUiState.userListCount -1;
    console.log('Inside handleAdminUserDeletedAction', newUiState.userList);
  }
  return newUiState;
}
