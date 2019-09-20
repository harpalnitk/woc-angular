import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as UiAction from '../../store/ui/ui.actions';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as SharedCAction from './shared-c.actions';


@Injectable()
export class SharedCEffect {
  URL = '/api/all'; // URL to web API
  constructor(private actions$: Actions,
              private http: HttpClient) {
  }


  loadComments$: Observable<Action> = createEffect(()=> this.actions$.pipe(
    ofType(SharedCAction.loadComments.type),
    tap((x) => {
       console.log('Inside sharedC load comments effect');
      return x;
    }),
    switchMap((action: any)=> {
      console.log('Action payload in SharedC Load Comments effect', action.payload);
      const paramsData = {
        page: action.payload.page
      };
      const httpParams = new HttpParams({fromObject : paramsData});
      const requestUrl =  `${this.URL}/${action.payload.category}/loadComments/${action.payload.id}`;
      return this.http.get<any>(requestUrl, {params: httpParams}).pipe(
        //catchError(this.handleError), // then handle the error
      );
    })
  ));

  sharedCFail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SharedCAction.sharedCFail),
    tap(x => {
      console.log('in sharedC fail error');
      return x;
    }),
    map((action) => new UiAction.UiMessageAction({message: action.payload, uiClass: UiAction.UiMessageClass.ERROR}) )

  ));
}
