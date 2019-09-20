import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of, concat} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import {catchError, map, retry, switchMap, tap} from 'rxjs/operators';
import {User} from '../../shared/models/user.model';
import * as UiAction from '../../store/ui/ui.actions';
import {UiMessageAction} from '../../store/ui/ui.actions';
import {HttpClient} from '@angular/common/http';
import * as UserActions from './user.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import {UiService} from '../../shared/services/ui.service';
import {Router} from '@angular/router';
import * as fromUser from './user.reducer';




const handleError = (errorRes: any) => {
  console.log('errorRes:', errorRes);
  /** here we have to return a non error observable
   so that outer observable stream does not die/completes*/
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.message) {
    return of(new UserActions.UserProfileFailAction(errorMessage));
  }
  switch (errorRes.error.message) {
    case 'INVALID_UPDATES':
      console.log('here2');
      errorMessage = `Invalid Updates!`;
      break;
    case 'INTERNAL_SERVER_ERROR':
      errorMessage = `Internal Server Error. Please try again.`;
      break;
    default:
      errorMessage = 'An error occurred';
  }
  console.log('here1');
  return of(new UserActions.UserProfileFailAction(errorMessage));

};



@Injectable()
export class UserEffect {
  userURL = '/api/user'; // URL to web API
  adminURL = '/api/admin'; // URL to web API
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private uiService: UiService,
    private router: Router,
    private store: Store<fromUser.State>) {}

  @Effect() loadUser$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.LOAD_USER_ACTION),
    tap((x) => {
      console.log('Inside  load user action');
      return x;
    }),
    switchMap((action: UserActions.LoadUserAction)=> {
      const requestUrl =  `${this.adminURL}/${action.payload}`;
      return this.http.get<User>(requestUrl).pipe(
        retry(1), // retry a failed request up to 2 times
        map(
          (user: User) => {
            return new UserActions.UserLoadedAction({user: user, redirect: false})
          }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  // @Effect({dispatch: false}) userLoaded$ = this.actions$.pipe(
  //   ofType(UserActions.UserActionTypes.USER_LOADED_ACTION),
  //   tap(x => {
  //     console.log('in user loaded action');
  //     return x;
  //   }),
  //   map((action: UserActions.UserLoadedAction) => {
  //     if(action.payload.redirect) {
  //       console.log('redirect is true');
  //       this.router.navigate(['/admin'],{ queryParams: { selectedId: action.payload.user._id}, queryParamsHandling: 'merge'});
  //     }
  //   } )
  // );

  @Effect() loadUserProfile$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.LOAD_USER_PROFILE_ACTION),
    tap((x) => {
      console.log('Inside load profile user action');
      return x;
    }),
    switchMap(() => {
      const requestUrl =  `${this.userURL}/me`;
      return this.http.get<User>(requestUrl).pipe(
        retry(1), // retry a failed request up to 2 times
        map(
          (user: User) => {
            return new UserActions.UserProfileLoadedAction({user: user, redirect: false})
          }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect({dispatch: false}) userProfileLoaded$ = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.USER_PROFILE_LOADED_ACTION),
    tap(x => {
      console.log('in user profile loaded action');
      return x;
    }),
    map((action: UserActions.UserProfileLoadedAction) => {
      if(action.payload.redirect) {
        console.log('redirect is true');
        this.router.navigate(['/user/me']);
      }
    } )
  );


  @Effect() editUser$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.EDIT_USER_PROFILE_ACTION),
    tap((x) => {
      console.log('Inside edit user action');
      return x;
    }),
    switchMap((action: UserActions.EditUserProfileAction) => {
      const requestUrl =  `${this.userURL}/edit`;
      return this.http.patch<User>(requestUrl, action.payload).pipe(
        map((user: User) => {
          this.uiService.showSnackBar({message: 'User Edited Successfully!!'});
          return new UserActions.EndUserProfileEditAction(user)
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


  @Effect() endUserEdit$: Observable<Action> = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.END_USER_PROFILE_EDIT_ACTION),
    map((action: UserActions.EndUserProfileEditAction) => {
     if(action.payload) {
this.store.dispatch(new AuthActions.UpdateAuthUserAction({
  roles: action.payload.roles,
  alias: action.payload.alias,
  avatar: action.payload.avatar,
}));
       return new UserActions.UserProfileLoadedAction({user: action.payload, redirect: true});
       // switchMap(()=> [new AuthActions.UpdateAuthUserAction({
       //   roles: action.payload.roles,
       //   alias: action.payload.alias,
       //   avatar: action.payload.avatar,
       // }),
       //   new UserActions.UserProfileLoadedAction({user: action.payload, redirect: true}) ])
     } else {
       return {type: 'DUMMY'};
     }
    }),
    catchError(() => {
        return of(new UiMessageAction({message: 'Error in loading User Profile Data after Edit.', uiClass: UiAction.UiMessageClass.ERROR}));
      }
    )
  );

  @Effect() userFail$ = this.actions$.pipe(
    ofType(UserActions.UserActionTypes.USER_PROFILE_FAIL_ACTION),
    tap(x => {
      console.log('in user fail error');
      return x;
    }),
    map((action: UserActions.UserProfileFailAction) => new UiMessageAction({message: action.payload, uiClass: UiAction.UiMessageClass.ERROR}) )
  );
}


// no need to subscribe taken care by @effect automatically
