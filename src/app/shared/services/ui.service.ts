import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, retry, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class UiService {
  constructor(private snackbar: MatSnackBar, private http: HttpClient) { }
  showSnackBar(error: any, action = null, duration = 3000) {
    const message = error.message;
    this.snackbar.open(message, action, {
      duration
    });
  }
  addQuestion(questionData: any) {
    console.log('Inside add question of UI Service', questionData);

    return this.http.post<any>('/api/question/add', questionData).pipe(
      tap(()=> {console.log('inside http request')}),
      retry(2), // retry a failed request up to 2 times
      catchError(this.handleError), // then handle the error
    );
  }





  private handleError(error: HttpErrorResponse) {
    console.log('error occurred');
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
