import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppConfigService} from '../../shared/services/app-config.service';
import {QuestionVM} from '../../shared-c/models/view-models/question-vm.model';
import * as _ from 'lodash';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as QuestionsActions from '../store/questions.actions';
import {dateForViewPage} from '../../shared-c/selectors/questions.selectors.component';



@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit, OnChanges {
@Input() question: QuestionVM;
  defaultUrl;
  guest: boolean = false;
  showCommentBox = false;
  constructor(private config: AppConfigService,
              private store: Store<fromRoot.AppState>) {
    this.defaultUrl = this.config.getConfig('defaultUrl');
  }

  ngOnInit() {
   console.log('ngOnInit', this.question.text );
  }
  getImageUrl(id: string) {
    //console.log("getImageURL", id);
    //console.log("getImageURL", this.question.text);
    return this.defaultUrl + "/api/user/"+id+"/avatar?"
      //+ this.timestamp
      ;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showCommentBox = false;
    //same component are being reused , only input property changes
   //console.log('ngOnChanges', this.question.text );
    //console.log('ngOnChanges topic', this.question.topic );
   this.question = _.cloneDeep(this.question);

    this.guest = !this.question.user ;
    this.question.topicViewValue = this.config.getConfig('topics')[+this.question.topic-1].viewValue;
    //this.question.imageURL = this.getImageUrl(this.question._id);

  }
  getViewDate() {
    return dateForViewPage(this.question.getCreated());
  }

  incrementLikeCount(value: number) {
    this.question.like_count = +this.question.like_count + value;
    // also need to update the store
    this.store.dispatch(QuestionsActions.updateQuestion({payload: this.question}));
  }
  incrementAnswerCount(value: number) {
    console.log('increment answer count', value)
    if(this.question.answer_count){
      this.question.answer_count.count = +this.question.answer_count.count + value;
    } else {
      this.question.answer_count = {count: 1};
    }
    this.store.dispatch(QuestionsActions.updateQuestion({payload: this.question}));

  }

  toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
  }
}
