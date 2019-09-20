import {createAction, props} from '@ngrx/store';
import {CommentVM} from '../models/view-models/comment-vm.model';

export interface CommentsData {
  comments: CommentVM[];
  count: number;
}

export const loadComments = createAction(
  '[SharedC] Load Comments',
  props<{ payload: {category: string, id: string, page: number} }>()
);

export const commentsLoaded = createAction(
  '[SharedC] Comments Loaded',
  props<{ payload: CommentsData }>()
);


export const sharedCFail = createAction(
  '[SharedC] Comments Fail',
  props<{ payload: string }>()
);
