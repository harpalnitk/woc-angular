import {User} from '../shared/models/user.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromAdmin from './store/admin.reducer';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {getCurrentUserInAdmin} from './store/admin.reducer';
import {switchMap, take} from 'rxjs/operators';
import * as AdminActions from './store/admin.actions';

@Injectable({providedIn: 'root'})
export class AdminUserResolverService implements Resolve<User>{
  constructor(private store: Store<fromAdmin.State>,
              private actions$: Actions){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    let id = route.paramMap.get('id');
    console.log('Inside admin user resolver service', id);
    return this.store.select(getCurrentUserInAdmin).pipe(
      take(1),
      switchMap(user => {
        if(user === null || user._id !== id){
          console.log('inside  admin user resolver');
          this.store.dispatch(new AdminActions.AdminLoadUserAction(id));
          return this.actions$.pipe(
            ofType(AdminActions.AdminActionTypes.ADMIN_USER_LOADED_ACTION),
            take(1)
          );
        } else {
          return of(user);
        }
      })
    );
  }
}
