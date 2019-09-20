import {User} from '../shared/models/user.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import * as fromUser from './store/user.reducer';
import * as UserActions from './store/user.actions';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';



@Injectable({providedIn: 'root'})
export class UserResolverService implements Resolve<User>{
  constructor(private store: Store<fromUser.State>,
              private actions$: Actions){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    let id = route.paramMap.get('id');
    if(id) {
      return this.store.select(fromUser.getViewUser).pipe(
        take(1),
        switchMap(user => {
          if(user === null || user._id !== id){
            console.log('inside  admin user resolver');
            this.store.dispatch(new UserActions.LoadUserAction(id));
            return this.actions$.pipe(
              ofType(UserActions.UserActionTypes.USER_LOADED_ACTION),
              take(1)
            );
          } else {
            return of(user);
          }
        })
      );
    } else {
      return this.store.select(fromUser.getUserProfile).pipe(
        take(1),
        switchMap(user => {
          if(user === null){
            console.log('inside user resolver');
            this.store.dispatch(new UserActions.LoadUserProfileAction());
            return this.actions$.pipe(
              ofType(UserActions.UserActionTypes.USER_PROFILE_LOADED_ACTION),
              take(1)
            );
          } else {
            return of(user);
          }
        })
      );
    }

  }
}
