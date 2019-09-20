import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
import {UiService} from '../shared/services/ui.service';
import {NavigationExtras, Router} from '@angular/router';
import * as fromRoot from '../app.reducer';
import {AuthData} from '../shared/models/auth-data.model';
import * as UI from '../store/ui/ui.actions';
import * as Auth from './store/auth.actions';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {retry, tap} from 'rxjs/operators';
import {User} from '../shared/models/user.model';
import {EMPTY, Observable, of} from 'rxjs';
import * as AuthActions from './store/auth.actions';
import {UserSummaryVM} from '../shared/models/view-models/user-summary-vm.model';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private uiService: UiService,
    private store: Store<fromRoot.AppState>) {
  }
  redirectUrl: string;
  authURL = '/api/auth'; // URL to web API
  private tokenExpirationTimer: any;
  user: UserSummaryVM;

  // initAuthListener() {
  //   this.getUser().subscribe(user => {
  //     if (user) {
  //       this.store.dispatch(new Auth.SetAuthenticated(user));
  //       this.router.navigate(['/']);
  //     } else {
  //       this.store.dispatch(new Auth.SetUnauthenticated());
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }


  // signUpUser(authData: AuthData) {
  //   console.log('method: signUpUser');
  //   this.store.dispatch(new UI.StartLoadingAction());
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   this.http.post(`${this.authURL}/signUp`,
  //     authData,
  //     {headers, observe: 'response'}).pipe(
  //     retry(1), // retry a failed request up to 1 times
  //   ).subscribe(
  //     (response) => {
  //       this.handleResponse(response);
  //     },
  //     (error) => {
  //       this.handleError(error);
  //     }
  //   );
  // }

  // signInUser(authData: AuthData) {
  //   console.log('method: signInUser');
  //   this.store.dispatch(new UI.StartLoadingAction());
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  //   this.http.post(`${this.authURL}/signIn`,
  //     authData,
  //     {headers, observe: 'response'}).
  //   subscribe(
  //     (response) => {
  //       this.handleResponse(response);
  //     },
  //     (error) => {
  //       this.handleError(error);
  //     }
  //   );
  // }

  isEmailTaken(email: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const requestUrl = `${this.authURL}/unique?email=${email}`;
    return this.http.get(`${requestUrl}`, {headers}).pipe(
      tap((response) => console.log('Response' + response)),
      retry(1), // retry a failed request up to 3 times
    );
  }

  // signout() {
  //
  //   this.http.post(`${this.authURL}/signOut`, {}, {observe: 'response'}).subscribe(
  //     (response) => {
  //       this.store.dispatch(new Auth.SetUnauthenticated());
  //       localStorage.removeItem('jwtToken');
  //       localStorage.removeItem('user');
  //       this.uiService.showSnackBar(response.body);
  //       this.router.navigate(['/signin']);
  //     },
  //     (error ) => {
  //       console.log('Error in logout operation', error);
  //       this.uiService.showSnackBar(error.error);
  //     }
  //   );
  // }

  // signoutAll() {
  //
  //   this.http.post(`${this.authURL}/signOutAll`, {}, {observe: 'response'}).subscribe(
  //     (response) => {
  //       this.store.dispatch(new Auth.SetUnauthenticated());
  //       localStorage.removeItem('jwtToken');
  //       localStorage.removeItem('user');
  //       this.uiService.showSnackBar(response.body);
  //       this.router.navigate(['/signin']);
  //     },
  //     (error ) => {
  //       console.log('Error in logout operation', error);
  //       this.uiService.showSnackBar(error.error);
  //     }
  //   );
  // }

  // handleResponse(response: any) {
  //   this.store.dispatch(new UI.StopLoadingAction());
  //   console.log(response);
  //   console.log(response.body);
  //   this.setAuthorizationToken(response.headers.get('x-auth-token'));
  //   this.setUser(response.body.user);
  //   this.uiService.showSnackBar(response.body);
  //   const redirect = this.redirectUrl ? this.redirectUrl : '/';
  //   const navigationExtras: NavigationExtras = {
  //     queryParamsHandling: 'preserve',
  //     preserveFragment: true
  //   };
  //   // Redirect the user
  //   this.router.navigate([redirect], navigationExtras);
  // }
  // handleError(error: any) {
  //   console.log(error);
  //   this.store.dispatch(new UI.StopLoadingAction());
  //   this.uiService.showSnackBar(error.error);
  // }
  // getAuthorizationToken() {
  //   return localStorage.getItem('jwtToken');
  // }
  // setAuthorizationToken(token: string) {
  //   localStorage.setItem('jwtToken', 'Bearer ' + token);
  // }
  // getUser(): Observable<User> {
  //   const value = localStorage.getItem('user');
  //   if (value) {
  //     return of(JSON.parse(value));
  //   } else {
  //     return EMPTY;
  //   }
  // }
  // setUser(user: User) {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.store.dispatch(new Auth.SetAuthenticated(user));
  // }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.LogoutAction());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  userHasRole(role) {
    this.store.select(fromRoot.getAuthUser).subscribe((user) => {
      this.user = user;
    });
    if(this.user) {
      return (this.user.roles || []).indexOf(role) > -1;
    } else {
      return false;
    }

  }

}
