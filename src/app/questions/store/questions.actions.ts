import {createAction, props} from '@ngrx/store';
import {QuestionVM} from '../../shared-c/models/view-models/question-vm.model';

export interface QuestionsData {
  questions: QuestionVM[];
  count: number;
}

export interface QuestionsListDisplayConstants {
  sort: string;
  order: string;
  page: number;
  limit: number;
  topic: string;
  search: string;
  view: string;
  userId: string;
}

export const loadQuestions = createAction(
  '[Questions] Load Questions',
  props<{ payload: QuestionsListDisplayConstants}>()
);

export const questionsLoaded = createAction(
  '[Questions] Questions Loaded',
  props<{ payload: QuestionsData }>()
);

export const resetQuestions = createAction(
  '[Questions] Reset Questions',
);

export const updateQuestion = createAction(
  '[Questions] Question Update',
  props<{ payload: QuestionVM }>()
);

export const questionsFail = createAction(
  '[Questions] Questions Fail',
  props<{ payload: string }>()
);
