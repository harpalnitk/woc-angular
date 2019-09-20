import {Action} from '@ngrx/store';

export enum UIActionTypes {
  START_LOADING_ACTION = '[UI] Start Loading',
  STOP_LOADING_ACTION = '[UI] Stop Loading',
  UI_MESSAGE_ACTION = '[UI] Ui Message Action',
  UI_MESSAGE_CLEAR_ACTION = '[UI] Ui Message Clear Action'
}



export class StartLoadingAction implements Action {
  readonly type = UIActionTypes.START_LOADING_ACTION;
}

export class StopLoadingAction implements Action {
  readonly type = UIActionTypes.STOP_LOADING_ACTION;
}

export interface UiMessageActionPayload {
  message: string;
  uiClass: string;
}
export enum UiMessageClass {
  SUCCESS = 'messages-success',
  ERROR = 'messages-error',
  WARN = 'messages-warn',
  INFO = 'messages-info'
}
export class UiMessageAction implements Action {
  readonly type = UIActionTypes.UI_MESSAGE_ACTION;
  constructor(public payload?: UiMessageActionPayload) {
  }
}

export class UiMessageClearAction implements Action {
  readonly type = UIActionTypes.UI_MESSAGE_CLEAR_ACTION;

}

export type UIActions =
  StartLoadingAction |
  StopLoadingAction |
  UiMessageAction |
  UiMessageClearAction;
