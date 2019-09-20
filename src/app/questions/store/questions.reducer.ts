import * as QuestionsAction from './questions.actions';
import * as fromRoot from '../../app.reducer';
import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import {QuestionVM} from '../../shared-c/models/view-models/question-vm.model';
import * as _ from 'lodash';
import {CommentVM} from '../../shared-c/models/view-models/comment-vm.model';


export interface QuestionsState {
  questionsList: QuestionVM[];
  currentQuestion: QuestionVM;
  isLoading: boolean;
  questionsListCount: number;
}

// Admin state knows about app state but app state
// does not know about admin state
// behind the scene ngrx will merge admin state with app state
// whenever the module is loaded, by few instructions
export interface State extends fromRoot.AppState {
  questions: QuestionsState;
}

const initialState: QuestionsState = {
  questionsList: [],
  currentQuestion: null,
  isLoading: false,
  questionsListCount: 0,
};

const questionsReducer = createReducer(
  initialState,
  on(QuestionsAction.loadQuestions, (state, action) => {return handleLoadQuestionsListAction(state, action)}),
  on(QuestionsAction.questionsLoaded, (state, action) => {return handleQuestionsListLoadedAction(state, action)}),
  on(QuestionsAction.updateQuestion, (state, action) => {return handleUpdateQuestionAction(state, action)}),
  on(QuestionsAction.resetQuestions, (state) => {return {...state, ...initialState}}),
  on(QuestionsAction.questionsFail, (state) => {return {...state, isLoading: false}}),

);

export function questionsReducerExported(state: QuestionsState | undefined, action: Action) {
  return questionsReducer(state, action);
}


export const getQuestionsState = createFeatureSelector<QuestionsState>('questions');
export const getCurrentQuestion
  = createSelector(getQuestionsState, (state: QuestionsState) => state.currentQuestion);
export const getIsLoadingState
  = createSelector(getQuestionsState, (state: QuestionsState) => state.isLoading);
export const getQuestionsListCount
  = createSelector(getQuestionsState, (state: QuestionsState) => state.questionsListCount);
export const getQuestionsList
  = createSelector(getQuestionsState, (state: QuestionsState) => state.questionsList);



function handleLoadQuestionsListAction(state: QuestionsState, action: any) {
  //console.log('action', action);
  const newUiState : QuestionsState = {
    currentQuestion: state.currentQuestion,
    questionsList: state.questionsList,
    isLoading: true,
    questionsListCount: state.questionsListCount,
  };


  return newUiState;
}
function handleQuestionsListLoadedAction(state: QuestionsState, action: any) {
  const newUiState : QuestionsState = {
    currentQuestion: state.currentQuestion,
    questionsList: state.questionsList,
    isLoading: false,
    questionsListCount: state.questionsListCount,
  };
  if(action.payload && action.payload.questions){

    newUiState.questionsList = [...state.questionsList, ...action.payload.questions];
    newUiState.questionsListCount = action.payload.count;

  }
  return newUiState;
}
function handleUpdateQuestionAction(state: QuestionsState, action: any) {
  const newUiState : QuestionsState = {
    currentQuestion: state.currentQuestion,
    questionsList: _.cloneDeep(state.questionsList),
    isLoading: false,
    questionsListCount: state.questionsListCount,
  };
  if(action.payload){
    let itemIndex = newUiState.questionsList.findIndex(item => item._id == action.payload._id);
    newUiState.questionsList[itemIndex] = action.payload;
  }
  return newUiState;
}
