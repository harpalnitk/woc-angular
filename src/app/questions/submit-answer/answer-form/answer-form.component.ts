import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import * as fromRoot from '../../../app.reducer';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserSummaryVM} from '../../../shared/models/view-models/user-summary-vm.model';
import {Store} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UiService} from '../../../shared/services/ui.service';
import {SharedCService} from '../../../shared-c/services/shared-c.service';


@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit, OnDestroy {
  answerForm: FormGroup;
  isLoading: boolean = false;

  addAnswerSubscription: Subscription;


  constructor(
              private sharedCService: SharedCService,
              private uiService: UiService,
              public dialogRef: MatDialogRef<AnswerFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.initForm();
  }

  initForm () {
    this.answerForm = new FormGroup({
      'text': new FormControl(null, Validators.required)
    });
   }
  onSubmit() {

    let answerData = this.answerForm.value;
    if (this.data.isAuth) {
      answerData.questionId = this.data.questionId;
    }
    this.isLoading = true;
    this.addAnswerSubscription = this.sharedCService.addAnswer(answerData).subscribe(
      (data) => {
        if (data.success) {
          console.log('success in adding answer');
          this.uiService.showSnackBar({message: 'Your answer submitted successfully. Thanks for contributing to Wisdom of Crowd!!!'});
          this.isLoading = false;
          this.dialogRef.close({success:true});
        }
      },
      (error) => {
        console.log(error);
        this.uiService.showSnackBar({message: 'Error in submitting answer.Please try again'});
        this.isLoading = false;
        this.dialogRef.close({success:false});
      });

  }

  close() {
    this.dialogRef.close({success:false});
  }
  ngOnDestroy(): void {
    if(this.addAnswerSubscription) {
      this.addAnswerSubscription.unsubscribe();
    }
  }

}
