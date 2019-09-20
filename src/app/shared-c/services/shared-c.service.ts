import { Injectable } from '@angular/core';
import {catchError, retry, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedCService {

  allURL = '/api/all'; // URL to web API

  constructor(private http: HttpClient) { }

  addAnswer(answerData: any) {
    console.log('Inside add answer of UI Service', answerData);

    return this.http.post<any>('api/answer/add', answerData).pipe(
      tap(()=> {console.log('inside http request')}),
      retry(2), // retry a failed request up to 2 times
      catchError(this.handleError), // then handle the error
    );
  }

  postComment(id: string, category: string, value: string) {
    console.log('Inside like in SharedCService', id);
    const requestUrl =  `${this.allURL}/${category}/comment/${id}`;
    return this.http.post<any>(requestUrl,{text: value}).pipe(
      catchError(this.handleError), // then handle the error
    );
  }

  like(id: string, category: string) {
    console.log('Inside like in SharedCService', id);
    const requestUrl =  `${this.allURL}/${category}/like/${id}`;
    return this.http.post<any>(requestUrl,{}).pipe(
      catchError(this.handleError), // then handle the error
    );
  }

  unLike(id: string, category: string) {
    console.log('Inside unLike in SharedCService', id);
    const requestUrl =  `${this.allURL}/${category}/unLike/${id}`;
    return this.http.post<any>(requestUrl,{}).pipe(
      catchError(this.handleError), // then handle the error
    );
  }

  likeStatus(id: string, category: string) {
    //console.log('Inside like Status in SharedCService', id);
    const requestUrl =  `${this.allURL}/${category}/likeStatus/${id}`;
    return this.http.get<any>(requestUrl).pipe(
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
      `${error.error}`);
  }
}
