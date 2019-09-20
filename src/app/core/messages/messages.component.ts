import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../app.reducer';
import * as fromUi from '../../store/ui/ui.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  message: string;
  errorMessageClass: string = 'messages-error';

  constructor(private store: Store<fromRoot.AppState>) { }

  ngOnInit() {
    this.store.select(fromRoot.getCurrentError).subscribe(
      (response: fromUi.ErrorMessage) => {
        if (response) {
          this.message = response.message;
          this.errorMessageClass = response.uiClass;
        }else {
          this.message = '';
        }

      });
  }

  close() {
    this.message = '';
  }

}
