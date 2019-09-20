import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from '../shared/models/user.model';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable()
export class UserService {
  userURL = '/api/user'; // URL to web API

  constructor(private http: HttpClient) { }

  loadUser(): Observable<User> {
    //console.log('Inside get User in user service');

    const requestUrl =  `${this.userURL}/me`;
    return this.http.get<User>(requestUrl).pipe(
      retry(1), // retry a failed request up to 2 times
      catchError(this.handleError), // then handle the error
      map(
        user => {
          // console.log(user);
          return user;
        })
    );
  }

  editUser(userData: any): Observable<User> {
    console.log('Inside get User in user service');

    const requestUrl =  `${this.userURL}/edit`;
    return this.http.patch<User>(requestUrl, userData).pipe(
      retry(1), // retry a failed request up to 2 times
      catchError(this.handleError), // then handle the error
      map(
        user => {
          // console.log(user);
          return user;
        })
    );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    console.error(`Error Message` + JSON.stringify(error.error));
    // return an observable with a user-facing error message
    return throwError(
      `${error.error}`);
  }
}
