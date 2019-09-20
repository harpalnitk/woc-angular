import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {UserSummaryVM} from '../../shared/models/view-models/user-summary-vm.model';
import {UiService} from '../../shared/services/ui.service';
import * as UiAction from '../../store/ui/ui.actions';
import { UiMessageAction} from '../../store/ui/ui.actions';

export interface AuthResponseData {
  message: string,
  user: {
    _id: string;
    email: string;
    roles: string [];
    alias?: string;
    avatar?: boolean;
  } ,
  expiresIn: number

}
const handleAuthentication = (token:string, expiresIn: number, _id: string,email: string, roles: string [], alias: string = null, avatar: boolean = false) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  // FOR LOCAL STORAGE
  const user =
    new UserSummaryVM(
      _id,
      email,
      roles,
      token,
      expirationDate,
      alias,
      avatar);
  localStorage.setItem('userData', JSON.stringify(user));
  return (new AuthActions.AuthenticateSuccessAction({
      _id: _id,
      email: email,
      roles: roles,
      _token: token,
      _tokenExpirationDate: expirationDate.toString(),
      alias: alias,
      avatar: avatar,
      redirect: true
    }
  ));
  // the action gets automatically dispatched by ngrx effects
};
const handleError = (errorRes: any) => {
console.log('errorRes:', errorRes);
  /** here we have to return a non error observable
   so that outer observable stream does not die/completes*/
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.message) {
    return of(new AuthActions.AuthenticateFailAction(errorMessage));
  }
  switch (errorRes.error.message) {
    // case 'EMAIL_EXISTS':
    //   errorMessage = 'This email exists already';
    //   break;
    // case 'OPERATION_NOT_ALLOWED':
    //   errorMessage = 'Password sign-in is disabled for this user.';
    //   break;
    // case 'TOO_MANY_ATTEMPTS_TRY_LATER':
    //   errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
    //   break;
    // case 'EMAIL_NOT_FOUND':
    //   errorMessage = `User not registered.`;
    //   break;
    // case 'INVALID_PASSWORD':
    //   errorMessage = `Password is not valid.`;
    //   break;
    // case 'USER_DISABLED':
    //   errorMessage = `User is disabled.`;
    //   break;
    case 'UNABLE_TO_LOGIN':
      errorMessage = `Unable to Login!`;
      break;
    case 'INTERNAL_SERVER_ERROR':
      errorMessage = `Internal Server Error. Please try again.`;
      break;
    default:
      errorMessage = 'An error occurred';
  }
  return of(new AuthActions.AuthenticateFailAction(errorMessage));

};



@Injectable()
export class AuthEffects {
  authURL = '/api/auth'; // URL to web API

  @Effect() authSignup = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.SIGNUP_START),
    tap(() => {console.log('In signup start action effect')}),
    switchMap((signupData: AuthActions.SignupStartAction) => {
      return this.http.post<HttpResponse<AuthResponseData>>(
        `${this.authURL}/signUp`,
        {
          email: signupData.payload.email,
          password: signupData.payload.password
        },
        {observe: 'response'}
      ).pipe(
        tap((resData) => {
          console.log('ResData: ', resData);
          console.log('ResData body: ', resData.body);
          this.authService.setLogoutTimer(+resData.body['expiresIn'] * 1000);
        }),
        map(resData => {
          return handleAuthentication(
            resData.headers.get('x-auth-token'),
            +resData.body['expiresIn'],
            resData.body['user']._id,
            resData.body['user'].email,
            resData.body['user'].roles,
            resData.body['user'].alias,
            resData.body['user'].avatar
          );
        }),
        catchError(errorRes => {
          console.log(errorRes);
          return handleError(errorRes);
        })
      );
    })
  );

  @Effect() authLogin = this.action$.pipe(
    // we can have comma separated actions in ofType
    // so that single effect lsitens to mltiple actions
    ofType(AuthActions.AuthActionTypes.LOGIN_START),
    switchMap((authData: AuthActions.LoginStartAction) => {
      return this.http.post<HttpResponse<AuthResponseData>>(
        `${this.authURL}/signIn`,
        {
          email: authData.payload.email,
          password: authData.payload.password
        },
        {observe: 'response'}
      ).pipe(
        tap((resData) => {
          console.log('ResData: ', resData);
          console.log('ResData body: ', resData.body);
          this.authService.setLogoutTimer(+resData.body['expiresIn'] * 1000);
        }),
        map(resData => {
          return handleAuthentication(
            resData.headers.get('x-auth-token'),
            +resData.body['expiresIn'],
            resData.body['user']._id,
            resData.body['user'].email,
            resData.body['user'].roles,
            resData.body['user'].alias,
            resData.body['user'].avatar
          );
          // the action gets automatically dispatched by ngrx effects
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
    // catchError can be put here as effect observable must not die
    // and if an error is thrown then observable completes
    // thus we catch error in the inner observable and not on our overall
    // observable stream

  );

  @Effect({dispatch: false}) authRedirect = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccessAction) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );


  @Effect() autoLogin = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.AUTO_LOGIN),
    map(() => {
      console.log('auto login');
      const userData: {
        _id: string,
        email: string,
        roles: string [],
        _token: string,
        _tokenExpirationDate: string,
        alias: string,
        avatar: boolean
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'DUMMYy'};
      }
      const loadedUser = new UserSummaryVM(
        userData._id,
        userData.email,
        userData.roles,
        userData._token,
        new Date(userData._tokenExpirationDate),
        userData.alias,
        userData.avatar

      );
      if (loadedUser.id) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccessAction({
          _id: loadedUser.id,
          email: loadedUser.email,
          roles: loadedUser.roles,
          _token: loadedUser.token,
          _tokenExpirationDate: userData._tokenExpirationDate,
          alias: loadedUser.alias,
          avatar: loadedUser.avatar,
            redirect: false
          }
        );

      }
      return {type: 'DUMMY'};
      // In case no local stored user is found
      // we still need to dispatch some action
    } )
  );

  @Effect() authLogout = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.LOGOUT),
    switchMap(() => {
      return this.http.post(`${this.authURL}/signOut`, {}, {observe: 'response'})
        .pipe(
        map((response) => {
          this.uiService.showSnackBar(response.body);
          return this.handleLogout();
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      )
    })
  );

  @Effect() authLogoutAll = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.LOGOUT_ALL),
    switchMap(() => {
      return this.http.post(`${this.authURL}/signOutAll`, {}, {observe: 'response'})
        .pipe(
          map((response) => {
            this.uiService.showSnackBar(response.body);
            return this.handleLogout();
          }),
          catchError(errorRes => {
            this.uiService.showSnackBar(errorRes.body);
            return handleError(errorRes);
          })
        )
    })
  );

  @Effect() authenticateFail = this.action$.pipe(
    ofType(AuthActions.AuthActionTypes.AUTHENTICATE_FAIL),
    map((action: AuthActions.AuthenticateFailAction) => new UiMessageAction({message: action.payload, uiClass: UiAction.UiMessageClass.ERROR}) )

  );

  handleLogout () {
    this.authService.clearLogoutTimer();
    localStorage.removeItem('userData');
    this.router.navigate(['/signin']);
    return new AuthActions.LogoutFinishAction();
  }



  constructor(private action$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private uiService: UiService) {}
}
