import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsComponent} from './questions.component';
import {QuestionsRoutingModule} from './questions-routing.module';
import { QuestionComponent } from './question/question.component';
import {StoreModule} from '@ngrx/store';
import {questionsReducerExported} from './store/questions.reducer';
import { QuestionListComponent } from './question-list/question-list.component';
import {EffectsModule} from '@ngrx/effects';
import {QuestionsEffect} from './store/questions.effect';
import {SharedCModule} from '../shared-c/shared-c.module';
import { SubmitAnswerComponent } from './submit-answer/submit-answer.component';
import { AnswerFormComponent } from './submit-answer/answer-form/answer-form.component';

@NgModule({
  declarations: [
    QuestionsComponent,
    QuestionComponent,
    QuestionListComponent,
    SubmitAnswerComponent,
    AnswerFormComponent],
  imports: [
    CommonModule,
    SharedCModule,
    QuestionsRoutingModule,
    StoreModule.forFeature('questions', questionsReducerExported),
    EffectsModule.forFeature([QuestionsEffect])
  ],
  entryComponents: [AnswerFormComponent]
})
export class QuestionsModule { }
