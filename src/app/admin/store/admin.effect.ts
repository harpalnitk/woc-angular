import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UiService} from '../../shared/services/ui.service';
import {Router} from '@angular/router';
import {concat, Observable, of} from 'rxjs';
import * as AdminActions from './admin.actions';
import * as UiAction from '../../store/ui/ui.actions';
import {catchError, map, retry, switchMap, tap} from 'rxjs/operators';
import {User, UserConstants} from '../../shared/models/user.model';





const handleError = (errorRes: any) => {
  console.log('errorRes:', errorRes);
  /** here we have to return a non error observable
   so that outer observable stream does not die/completes*/
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.message) {
    return of(new AdminActions.AdminUserFailAction(errorMessage));
  }
  switch (errorRes.error.message) {
    case 'USER_ALREADY_REGISTERED':
      errorMessage = `User with given email id already registered.`;
      break;
    case 'INVALID_ID':
      errorMessage = `User ID is invalid.`;
      break;
    case 'USER_NOT_FOUND':
      errorMessage = `User with given id not found.`;
      break;
    case 'INVALID_UPDATES':
      errorMessage = `Invalid Updates!`;
      break;
    case 'INTERNAL_SERVER_ERROR':
      errorMessage = `Internal Server Error. Please try again.`;
      break;
    default:
      errorMessage = 'An error occurred';
  }
  return of(new AdminActions.AdminUserFailAction(errorMessage));

};


@Injectable()
export class AdminEffect {
  adminURL = '/api/admin'; // URL to web API
  constructor(    private actions$: Actions,
                  private http: HttpClient,
                  private uiService: UiService,
                  private router: Router) {
  }

  @Effect() loadAdminUserList$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_LOAD_USER_LIST_ACTION),
    tap((x) => {
      console.log('Inside admin load user list action');
      return x;
    }),
    switchMap((action: AdminActions.AdminLoadUserListAction)=> {
      console.log('Payload:', action.payload);


      const paramsData = {
        sort: action.payload.sort,
        order: action.payload.order,
        offset: (action.payload.page * action.payload.limit) + '',
        limit: action.payload.limit + '',
        search: action.payload.search
      };

      const httpParams = new HttpParams({fromObject : paramsData});
      const requestUrl = `${this.adminURL}/userList`;
      return this.http.get<AdminActions.UsersData>(requestUrl, {params: httpParams}).pipe(
        retry(1), // retry a failed request up to 2 times
        map(
          (usersData: AdminActions.UsersData) => {
            let deSerializedUserData: User[] = [];
            for (const user of usersData.users) {
              user.roles = user.roles.map(value => {
                return UserConstants.ROLES.filter(function (n) {
                  return n.value === value;
                })[0].viewValue;
              });
              deSerializedUserData.push(new User().deserialize(user));
            }
            return new AdminActions.AdminUserListLoadedAction({users: deSerializedUserData, total_count: usersData.total_count})
          }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect() loadAdminUser$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_LOAD_USER_ACTION),
    tap((x) => {
      console.log('Inside admin load user action');
      return x;
    }),
    switchMap((action: AdminActions.AdminLoadUserAction)=> {
      const requestUrl =  `${this.adminURL}/${action.payload}`;
      return this.http.get<User>(requestUrl).pipe(
        retry(1), // retry a failed request up to 2 times
        map(
          (user: User) => {
            return new AdminActions.AdminUserLoadedAction({user: user, redirect: false})
          }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );
  @Effect() addUserInAdmin$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_START_ADD_USER_ACTION),
    tap((x) => {
      console.log('Inside admin add user action');
      return x;
    }),
    switchMap((action: AdminActions.AdminStartAddUserAction) => {
      const requestUrl =  `${this.adminURL}/add`;
      return this.http.post<User>(requestUrl, action.payload).pipe(
        map((user: User) => {
          this.uiService.showSnackBar({message: 'User Added Successfully!!'});
          return new AdminActions.AdminEndAddUserAction(user);
        }),
        catchError(errorRes => {
          return concat(
            handleError(errorRes),
            // of(new UserAction.EndUserEditAction())
          )

        })
      );
    })
  );

  @Effect() adminEndUserAdd$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_END_ADD_USER_ACTION),
    map((action: AdminActions.AdminEndAddUserAction) => {
      if(action.payload) {
        return new AdminActions.AdminUserLoadedAction({user: action.payload, redirect: true});
      } else {
        return {type: 'DUMMY'};
      }
    }),
    catchError(() => {
        return of(new UiAction.UiMessageAction({message: 'Error in loading User Data after Add.', uiClass: UiAction.UiMessageClass.ERROR}));
      }
    )
  );

  @Effect() editUserInAdmin$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_EDIT_USER_ACTION),
    tap((x) => {
      console.log('Inside admin edit user action');
      return x;
    }),
    switchMap((action: AdminActions.AdminEditUserAction) => {
      const requestUrl =  `${this.adminURL}/${action.payload.id}/edit`;
      return this.http.patch<User>(requestUrl, action.payload.formData).pipe(
        map((user: User) => {
          this.uiService.showSnackBar({message: 'User Edited Successfully!!'});
          return new AdminActions.AdminEndUserEditAction(user);
        }),
        catchError(errorRes => {
          return concat(
            handleError(errorRes),
            // of(new UserAction.EndUserEditAction())
          )

        })
      );
    })
  );

  @Effect() deleteUserInAdmin$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_DELETE_USER_ACTION),
    tap((x) => {
      console.log('Inside admin delete user action');
      return x;
    }),
    switchMap((action: AdminActions.AdminDeleteUserAction) => {
      const requestUrl =  `${this.adminURL}/${action.payload}`;
      return this.http.delete<any>(requestUrl).pipe(
        map((data) => {
          this.uiService.showSnackBar(data);
          return new AdminActions.AdminEndDeleteUserAction(action.payload);
        }),
        catchError(errorRes => {
          return concat(
            handleError(errorRes),
          )
   })
      );
    })
  );

  @Effect() adminEndUserEdit$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_END_USER_EDIT_ACTION),
    map((action: AdminActions.AdminEndUserEditAction) => {
      if(action.payload) {
        return new AdminActions.AdminUserLoadedAction({user: action.payload, redirect: true});
      } else {
        return {type: 'DUMMY'};
      }
    }),
    catchError(() => {
        return of(new UiAction.UiMessageAction({message: 'Error in loading User Data after Edit.', uiClass: UiAction.UiMessageClass.ERROR}));
      }
    )
  );

  @Effect({dispatch: false}) userLoaded$ = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_USER_LOADED_ACTION),
    tap(x => {
      console.log('in admin user loaded action');
      return x;
    }),
    map((action: AdminActions.AdminUserLoadedAction) => {
      if(action.payload.redirect) {
        console.log('redirect is true');
        this.router.navigate(['/admin'],{ queryParams: { selectedId: action.payload.user._id}, queryParamsHandling: 'merge'});
      }
    } )
  );

  @Effect() userFail$ = this.actions$.pipe(
    ofType(AdminActions.AdminActionTypes.ADMIN_USER_FAIL_ACTION),
    tap(x => {
      console.log('in admin user fail error');
      return x;
    }),
    map((action: AdminActions.AdminUserFailAction) => new UiAction.UiMessageAction({message: action.payload, uiClass: UiAction.UiMessageClass.ERROR}) )
  );
}
