import {Injectable} from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Action} from '@ngrx/store';
import * as QuestionsAction from './questions.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as UiAction from '../../store/ui/ui.actions';
import {QuestionVM} from '../../shared-c/models/view-models/question-vm.model';


const handleError = (errorRes: any) => {
  console.log('errorRes:', errorRes);
  /** here we have to return a non error observable
   so that outer observable stream does not die/completes*/
  let errorMessage = 'An unknown error occurred';
  if (!errorRes.error || !errorRes.error.message) {
    return of(QuestionsAction.questionsFail({payload: errorMessage}));
  }
  switch (errorRes.error.message) {
    // case 'USER_ALREADY_REGISTERED':
    //   errorMessage = `User with given email id already registered.`;
    //   break;
    // case 'INVALID_ID':
    //   errorMessage = `User ID is invalid.`;
    //   break;
    // case 'USER_NOT_FOUND':
    //   errorMessage = `User with given id not found.`;
    //   break;
    // case 'INVALID_UPDATES':
    //   errorMessage = `Invalid Updates!`;
    //   break;
    case 'INTERNAL_SERVER_ERROR':
      errorMessage = `Internal Server Error. Please try again.`;
      break;
    default:
      errorMessage = 'An error occurred';
  }
  return of(QuestionsAction.questionsFail({payload: errorMessage}));

};

@Injectable()
export class QuestionsEffect {
  questionsURL = '/api/question'; // URL to web API
  constructor(private actions$: Actions,
              private http: HttpClient) {
  }

    loadQuestionsList$: Observable<Action> = createEffect(()=> this.actions$.pipe(
    ofType(QuestionsAction.loadQuestions.type),
    tap((x) => {
      // console.log('Inside questions load question list effect');
      return x;
    }),
    switchMap((action: any)=> {
      console.log('Action payload in Questions effect', action.payload);
      const paramsData = {
        sort: action.payload.sort,
        order: action.payload.order,
        offset: (action.payload.page * action.payload.limit) + '',
        limit: action.payload.limit + '',
        topic: action.payload.topic,
        search: action.payload.search,
        view: action.payload.view,
        userId: action.payload.userId
      };
      const httpParams = new HttpParams({fromObject : paramsData});
      const requestUrl = `${this.questionsURL}/loadQuestionsList`;

      return this.http.get<QuestionsAction.QuestionsData>(requestUrl, {params: httpParams}).pipe(
        map((questionsData)=> {
          console.log('questionsData in question effect', questionsData);
          let deserializedQuestions: QuestionVM[] = [];
          for (const question of questionsData.questions) {
            deserializedQuestions.push(new QuestionVM().deserialize(question));
          }
          console.log('De-serialized in question effect', deserializedQuestions);
          return  QuestionsAction.questionsLoaded({payload: {questions: deserializedQuestions, count: questionsData.count}})

        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      );
    })
  ));

   questionsFail$: Observable<Action> = createEffect(() => this.actions$.pipe(
ofType(QuestionsAction.questionsFail),
      tap(x => {
        console.log('in questions fail error');
        return x;
      }),
      map((action) => new UiAction.UiMessageAction({message: action.payload, uiClass: UiAction.UiMessageClass.ERROR}) )

    ));

}
