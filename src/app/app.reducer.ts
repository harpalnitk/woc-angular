
import * as fromUi from './store/ui/ui.reducer';
import * as fromAuth from './auth/store/auth.reducer';
import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {routerReducer, RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from './shared/custom-route-serializer';
import * as _ from 'lodash';

// deep-freeze-strict is used internally by @ngrx/store-freeze
// const deepFreeze = require('deep-freeze-strict');

export interface AppState {
  ui: fromUi.State;
  auth: fromAuth.State;
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<AppState> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
  router: routerReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
export const getCurrentError = createSelector(getUiState, fromUi.getCurrentError);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);
export const getAuthUser = createSelector(getAuthState, fromAuth.getAuthUser);
export const getAuthLoading = createSelector(getAuthState, fromAuth.getAuthLoading);
export const getAuthError = createSelector(getAuthState, fromAuth.getAuthError);

export const selectReducerState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
  >('router');
export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);

export const getIsAuthUserAdmin = createSelector(
  getAuthUser,
  (user)=> {
    const adminRoles = ['D', 'Y'];
    if(user && user.roles) {
      return _.some(adminRoles, (el) => _.includes(user.roles, el));
    } else {
      return false;
    }
  }
);
