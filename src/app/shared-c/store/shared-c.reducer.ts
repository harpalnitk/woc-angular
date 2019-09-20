import {CommentVM} from '../models/view-models/comment-vm.model';
import * as fromRoot from '../../app.reducer';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as SharedCAction from './shared-c.actions';
import {getQuestionsState, QuestionsState} from '../../questions/store/questions.reducer';


export interface SharedCState {

  commentMap: [{category: string,questionId: string, page: number,comments: CommentVM[]}],
  isLoading: boolean
}

export interface State extends fromRoot.AppState {
  sharedC: SharedCState;
}

const initialState: SharedCState = {
  commentMap: null,
  isLoading: false
};

const sharedCReducer = createReducer(
  initialState,
  on(SharedCAction.loadComments, (state, action) => {return handleLoadCommentsAction(state, action)}),

  on(SharedCAction.sharedCFail, (state) => {return {...state, isLoading: false}}),

);

export function sharedCReducerExported(state: SharedCState | undefined, action: Action) {
  return sharedCReducer(state, action);
}

export const getSharedCState = createFeatureSelector<SharedCState>('sharedC');
export const getIsLoadingState
  = createSelector(getSharedCState, (state: SharedCState) => state.isLoading);

function handleLoadCommentsAction(state: SharedCState, action: any) {
  //console.log('action', action);
  const newUiState : SharedCState = {
    commentMap: state.commentMap,
    isLoading: true
  };
  return newUiState;
}

function handleCommentsLoadedAction(state: SharedCState, action: any) {
  const newUiState : SharedCState = {
    commentMap: state.commentMap,
    isLoading: false
  };
  if(action.payload && action.payload.comments){

    // newUiState.commentMap = [...state.questionsList, ...action.payload.questions];
    // newUiState.questionsListCount = action.payload.count;

  }
  return newUiState;
}
