import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType,
  HttpRequest, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import {Observable, of, Subject} from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';


@Injectable()
export class UploaderService {
  // create a new progress-subject for every file
  uploadURL = '/api/user/upload/avatar'; // URL to web API

  constructor(
    private http: HttpClient) {}

  // If uploading multiple files, change to:
  // upload(files: FileList) {
  //   const formData = new FormData();
  //   files.forEach(f => formData.append(f.name, f));
  //   new HttpRequest('POST', '/upload/file', formData, {reportProgress: true});
  //   ...
  // }

  upload(file: File, path: string, id: string): Observable<any> {
    const progress = new Subject<any>();
    if (!file) { return; }

    // create a new multipart-form for every file
    const formData: FormData = new FormData();
    formData.append('avatar', file, file.name);
    formData.append('path', path);
    formData.append('id', id);

   // COULD HAVE WRITTEN:
   //  return this.http.post('/api/uploads/user', file, {
   //    reportProgress: true,
   //    observe: 'events'
   //  }).pipe(
   //    map(event => this.getEventMessage(event, file)),
   //    tap(message => {
   //      console.log(message);
   //    }),
   //    last(), // return last (completed) message to caller
   //    catchError(this.handleError(file))
   //  );

    // Create the request object that POSTs the file to an upload endpoint.
    // The `reportProgress` option tells HttpClient to listen and return
    // XHR progress events.

    const req = new HttpRequest('POST', `${this.uploadURL}?path=${path}&id=${id}`, formData, {
      reportProgress: true
    });

    // The `HttpClient.request` API produces a raw event stream
    // which includes start (sent), progress, and response events.
    this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap(message => {
        // console.log(message);
      }),
      // last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    ).subscribe(        (data) => {
        //console.log('Data' + data);
        progress.next(data);
      },
      (error) => {
        //console.log('Error' + error);
        progress.next(error.error);
      }
    );
    return progress.asObservable();
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return percentDone;
        // return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
      {
        //console.log('Response Body' + event.body);
        //console.log('Response Body JSON' + JSON.stringify(event.body));
       // return `File "${file.name}" was completely uploaded!`;
        return event.body;
      }
      default:
        {
        //console.log('Response Body' + event.type);
        return `File "${file.name}" surprising upload event: ${event.type}.`;
      }
    }
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */
  private handleError(file: File) {
    // const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;
      console.log(message);

      // this.messenger.add(`${userMessage} ${message}`);

      // Let app keep running but indicate failure.
       return of({success: false});
      // return ;
    };
  }

  // private showProgress(message: string) {
  //   this.messenger.add(message);
  // }
}


