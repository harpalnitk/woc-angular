import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import * as fromApp from '../app.reducer';
import {Store} from '@ngrx/store';
import {getIsAuthUserAdmin} from '../app.reducer';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService,
              private store: Store<fromApp.AppState>) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.store.select(getIsAuthUserAdmin).pipe(take(1));
  }
  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

}
