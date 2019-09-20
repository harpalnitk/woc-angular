
import * as AppUI from './ui.actions';

export interface ErrorMessage {
  message: string;
  uiClass: string;
}

export interface State {
  isLoading: boolean;
  currentError?: ErrorMessage;
}

const initialState: State = {
  isLoading: false
};

export function uiReducer(state = initialState, action: AppUI.UIActions) {
  switch (action.type) {
    case AppUI.UIActionTypes.START_LOADING_ACTION:
      console.log('ui action start loading');
      return {
        ...state, isLoading: true
      };
    case AppUI.UIActionTypes.STOP_LOADING_ACTION:
      console.log('ui action stop loading');
      return {
        ...state, isLoading: false
      };
    case AppUI.UIActionTypes.UI_MESSAGE_ACTION:
      return handleErrorOccurredAction(state, action);
    case AppUI.UIActionTypes.UI_MESSAGE_CLEAR_ACTION:
      return {...state, currentError: null}
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => state.isLoading;
export const getCurrentError = (state: State) => state.currentError;

function handleErrorOccurredAction(state: State, action: AppUI.UiMessageAction) {
  const newUiState = Object.assign({}, state);
  newUiState.currentError = action.payload;
  return newUiState;
}
