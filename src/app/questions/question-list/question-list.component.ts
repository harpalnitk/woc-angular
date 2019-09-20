import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as QuestionsActions from '../store/questions.actions';
import {Store} from '@ngrx/store';
import * as fromQuestions from '../store/questions.reducer';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {BehaviorSubject, merge, Observable, Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, startWith, switchMap, throttleTime} from 'rxjs/operators';
import {Actions, ofType} from '@ngrx/effects';
import {ActivatedRoute, NavigationCancel, Router} from '@angular/router';
import {UiService} from '../../shared/services/ui.service';
import {QuestionVM} from '../../shared-c/models/view-models/question-vm.model';
import {getSortViewValue} from '../../shared-c/selectors/questions.selectors.component';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionListComponent implements OnInit , OnDestroy, AfterViewInit{

  questions$: Observable<QuestionVM[]>;
  questionsSubscription: Subscription;
  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  limit: number = 10;
  page: number = 0;
  total_count: number = 0;
  offset$ = new BehaviorSubject<number>(null);
  loadItems$= new Subject();
  viewItemCriteria: string = 'all';
  sort: string = '_id';
  topic: string = '1';
  sort_text = 'Most Recent';
  isAuth = false;
  userSubscription: Subscription;
  userId;



  totalCountSubscription: Subscription;
  navCancel: Observable<NavigationCancel>;

  constructor(
    //private store: Store<fromQuestions.State>,
              private actions$: Actions,
              private router: Router,
              private route: ActivatedRoute,
              private uiService: UiService,
              private store: Store<fromRoot.AppState>) {
    // Create a new Observable the publishes only the NavigationEnd event
    this.navCancel = router.events.pipe(
      filter(evt => evt instanceof NavigationCancel)
    ) as Observable<NavigationCancel>;
  }

  ngOnInit() {
    //console.log('Inside init of questionslist');
     this.questions$ = this.store.select(fromQuestions.getQuestionsList);
     this.totalCountSubscription = this.store.select(fromQuestions.getQuestionsListCount).subscribe(count => this.total_count = count);
    // Message to be displayed when auth guard denies permission to non admin users.
    this.navCancel.subscribe((evt) => {
      console.log('Navigation Cancel event' + evt);
      this.uiService.showSnackBar({message: 'Please login to continue!!'});
    });
    this.userSubscription = this.store.select(fromRoot.getAuthUser).subscribe(user => {
      this.isAuth = !!user;
      if(this.isAuth) {
        this.userId = user.id;
      }
    });
  }

  ngAfterViewInit() {
    this.questionsSubscription = merge(this.offset$, this.loadItems$).pipe(
      startWith({}),
      throttleTime(500),
      distinctUntilChanged(),
      switchMap(() => {
        console.log('this.page in switchmap in ngAfterViewInit', this.page);
        this.store.dispatch(QuestionsActions.loadQuestions({payload: {sort: this.sort, order: 'desc', page: this.page, limit: 10, topic: this.topic, search: '', view: this.viewItemCriteria, userId: this.userId }}));
        return this.actions$.pipe(
          ofType(QuestionsActions.questionsLoaded.type),
          // take(1)
        );
      })
    ).subscribe();
  }

  // example
  // go() {
  //   this.viewport.scrollToIndex(23)
  // }

  nextBatch(e, x) {
    // total_items_in_viewport as input is not actually needed we can get the same from  this.viewport.getRenderedRange().end
    let items_rendered = this.viewport.getRenderedRange().end;
    if (items_rendered >= this.total_count) {
      return;
    }
    const items_in_viewport = this.viewport.getDataLength();
    console.log(`${items_rendered}, '>=', ${items_in_viewport}`);
    if (items_rendered === items_in_viewport) {
      this.page = items_rendered/this.limit;
      console.log('page in scroll function', this.page);
      this.offset$.next(items_rendered);
    }
  }

  trackByIdx(i) {
    return i;
  }


  viewItemChange(value: string) {
    this.viewItemCriteria = value;
    this.resetState(value);
  }

  sortChange(value: string) {
    this.sort = value;
    this.sort_text = getSortViewValue(value);
    this.resetState(value);
  }



  topicChange(value: string) {
    this.topic = value;
    this.resetState(value);
  }

  resetState(value: string) {
    console.log(value);
    this.page = 0;
    this.store.dispatch(QuestionsActions.resetQuestions());
    this.loadItems$.next(value);
  }
  ngOnDestroy() {
    this.store.dispatch(QuestionsActions.resetQuestions());
    if(this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }
    if(this.totalCountSubscription) {
      this.totalCountSubscription.unsubscribe();
    }
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

  }
}
