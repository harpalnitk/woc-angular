import {Component, OnDestroy} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import * as fromRoot from '../../../app.reducer';
import {Store} from '@ngrx/store';
import {AppConfigService} from '../../../shared/services/app-config.service';
import {Subscription} from 'rxjs';
import {UserSummaryVM} from '../../../shared/models/view-models/user-summary-vm.model';
import {UiService} from '../../../shared/services/ui.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnDestroy{
  askQuestionForm: FormGroup;
  isLoading: boolean = false;
  isAuth: boolean = false;
  hasName: boolean = false;
  userSubscription: Subscription;
  addQuestionSubscription: Subscription;
  user: UserSummaryVM;
  topics;

  constructor(private store: Store<fromRoot.AppState>,
              private config: AppConfigService,
    private uiService: UiService,
    public dialogRef: MatDialogRef<AskQuestionComponent>) {}

  ngOnInit() {
    this.userSubscription = this.store.select(fromRoot.getAuthUser).subscribe(user => {
      this.isAuth = !!user;
      this.user = user
    });
    this.topics = this.config.getConfig('topics');
    this.initForm();
  }

  initForm () {

    this.askQuestionForm = new FormGroup({
      'text': new FormControl(null, Validators.required),
      contact: new FormGroup({
        'email': new FormControl(null,  {validators: [Validators.email]}),
        'phone': new FormControl(null),
        'name': new FormControl(null, [Validators.required]),
      }),
       'topic': new FormControl(null),
    }, { validators: phoneOrEmailRequired });
    if (this.isAuth) {
      console.log('patching form');
      this.askQuestionForm.patchValue({
        contact: {
          'name' : this.user.alias,
          'email' : this.user.email
        },
      });
      this.hasName = !!this.user.alias;
      this.name.clearValidators();
      this.name.updateValueAndValidity();
      this.email.clearValidators();
      this.email.updateValueAndValidity();
    }
  }

  get email() { return this.askQuestionForm.get('contact.email'); }

  get name() { return this.askQuestionForm.get('contact.name'); }
  get phone() { return this.askQuestionForm.get('contact.phone'); }
  get text() { return this.askQuestionForm.get('text'); }
  get topic() { return this.askQuestionForm.get('topic'); }


  onSubmit() {
    console.log("this.askQuestionForm.value", this.askQuestionForm.value);
    let questionData = this.askQuestionForm.value;
    // if(questionData.contact.email === null) {
    //   console.log('email is null');
    //   delete questionData.contact.email;
    // }
    console.log("questionData", questionData);
    if (this.isAuth) {
      questionData.user = this.user.id;
    }
    this.isLoading = true;
    this.addQuestionSubscription = this.uiService.addQuestion(questionData).subscribe(
      (data) => {
        if (data.success) {
          console.log('success in adding question');
          this.uiService.showSnackBar({message: 'Your question submitted successfully. Please wait for crowd to reply.'});
          this.isLoading = false;
          this.dialogRef.close();
        }
      },
      (error) => {
        console.log(error);
        this.uiService.showSnackBar({message: 'Error in submitting question.Please try again'});
        this.isLoading = false;
        this.dialogRef.close();
      });

  }
  close(){
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if(this.addQuestionSubscription) {
      this.addQuestionSubscription.unsubscribe();
    }
  }
}



/** A hero's name can't match the hero's alter ego */
export const phoneOrEmailRequired: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const phone = control.get('contact.phone');
  const email = control.get('contact.email');

  return (phone.value !== null && phone.value !== '') || (email.value !== null && email.value !== '') ? null : { 'phoneOrEmail': true };
};
