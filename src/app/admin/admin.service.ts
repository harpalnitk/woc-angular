import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {User} from '../shared/models/user.model';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  adminUrl = '/api/admin';  // URL to web api
  constructor(private http: HttpClient) { }

  // getUserList(sort: string = '_id', order: string = 'desc', page: number = 0, limit: number = 10, search: string)
  //   : Observable<UsersData> {
  //   console.log('sort:' + sort);
  //   console.log('order:' + order);
  //   console.log('page:' + page);
  //   console.log('limit:' + limit);
  //   console.log('search:' + search);
  //   const requestUrl = `${this.adminUrl}/userList`;
  //   const paramsData = {
  //     sort: sort,
  //     order: order,
  //     offset: (page * limit) + '',
  //     limit: limit + '',
  //     search: search
  //   };
  //
  //   const httpParams = new HttpParams({fromObject : paramsData});
  //   // const requestUrl =
  //   // `${href}?sort=${sort}&order=${order}&offset=${(page) * limit}&limit=${limit}&search=${search}`;
  //
  //   return this.http.get<UsersData>(requestUrl, {params: httpParams}).pipe(
  //     retry(2), // retry a failed request up to 3 times
  //     catchError(this.handleError), // then handle the error
  //     map((data: UsersData) => {
  //
  //         return data;
  //       }
  //     )
  //   );
  // }

  getUser(id: string): Observable<User> {
    console.log('Inside get User in admin service');
    // Add safe, URL encoded profile parameter if user with profile is required
    // const options = profile ?
    //   { params: new HttpParams().set('profile', 'true') } : {};
    const requestUrl =  `${this.adminUrl}/${id}`;
    return this.http.get<User>(requestUrl).pipe(
      retry(2), // retry a failed request up to 2 times
      catchError(this.handleError), // then handle the error
      map(
        user => {
          console.log(user);
          return user;
        })
    );
  }
  addUser(userData: any) {
    console.log('inside add users in admin service');
    return this.http.post<any>(`${this.adminUrl}/add`, userData).pipe(
      catchError(this.handleError), // then handle the error
    );
  }
  updateUser(id: string, userData: any) {
    console.log('inside update user in admin service');
    const requestUrl = `${this.adminUrl}/${id}/edit`;
    return this.http.post<any>(requestUrl, userData).pipe(
      catchError(this.handleError), // then handle the error
    );
  }

  deleteUser(id: string) {
    console.log('inside delete users in admin service');
    const requestUrl = `${this.adminUrl}/${id}`; // DELETE api/heroes/42
    return this.http.delete<any>(requestUrl).pipe(
      catchError(this.handleError), // then handle the error
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
      `${error.error.message}`);
  }
}
