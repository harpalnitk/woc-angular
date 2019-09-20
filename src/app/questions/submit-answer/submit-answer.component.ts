import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AnswerFormComponent} from './answer-form/answer-form.component';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import {Subscription} from 'rxjs';
import {UserSummaryVM} from '../../shared/models/view-models/user-summary-vm.model';
import {UiService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-submit-answer',
  templateUrl: './submit-answer.component.html',
  styleUrls: ['./submit-answer.component.css']
})
export class SubmitAnswerComponent implements OnInit {
  @Output() count = new EventEmitter<number>();
  @Input() id: string;
  isAuth = false;
  userSubscription: Subscription;
  user: UserSummaryVM;

  constructor(public dialog: MatDialog,
              private store: Store<fromRoot.AppState>,
              private uiService: UiService,) { }

  ngOnInit() {
    this.userSubscription = this.store.select(fromRoot.getAuthUser).subscribe(user => {
      this.isAuth = !!user;
      this.user = user
    });
  }
  openDialog(): void {
    if(this.isAuth) {
      const dialogRef = this.dialog.open(AnswerFormComponent, {
        width: '500px',
        data: {questionId: this.id, isAuth: this.isAuth}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if(result && result.success ) {
          this.count.emit(1);
        }
      });
    } else {
      this.uiService.showSnackBar({message: 'Please login to continue!!'})
    }

  }
}
