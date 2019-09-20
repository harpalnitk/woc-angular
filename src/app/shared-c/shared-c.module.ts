import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {AppSortSelectorComponent, AppTopicSelectorComponent, AppViewItemSelectorComponent} from './selectors/questions.selectors.component';
import { LikeComponent } from './like/like.component';
import { CommentComponent } from './comment/comment.component';
import { CommentBoxComponent } from './comment/comment-box/comment-box.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {sharedCReducerExported} from './store/shared-c.reducer';
import {SharedCEffect} from './store/shared-c.effect';

@NgModule({
  declarations: [
    AppSortSelectorComponent,
    AppTopicSelectorComponent,
    AppViewItemSelectorComponent,
    LikeComponent,
    CommentComponent,
    CommentBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('sharedC', sharedCReducerExported),
    EffectsModule.forFeature([SharedCEffect])
  ],
  exports: [
    SharedModule,
    AppSortSelectorComponent,
    AppTopicSelectorComponent,
    AppViewItemSelectorComponent,
    LikeComponent,
    CommentComponent,
    CommentBoxComponent
  ]
})
export class SharedCModule { }
