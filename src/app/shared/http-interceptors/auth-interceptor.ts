import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import * as fromApp from '../../app.reducer';
import {Store} from '@ngrx/store';
import {exhaustMap, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor( private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //console.log('Inside auth interceptor')
    // take(1) automatically unsubscribes also afetr fetching first value
    // so no need to unsubscribe
    // exhaustMap let outer observable to finish and return its results to
    // inner observable and finally return the results of inner observable
    // if second observable is running and first observable emit any value
    // that value is completely ignored by the exhaust map
    return this.store.select(fromApp.getAuthUser).pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const token = (req.url.indexOf('/api/auth/signOut') != -1) ? user.getTokenForSignOut() : user.token;
        //console.log('Inside http interceptor token', token)
        const modifiedReq = req.clone({setHeaders: {Authorization: token}});
        return next.handle(modifiedReq);
      })
    );
    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.


    // send cloned request with header to the next handler.
  }
}
