import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as AuthActions from '../store/auth.actions';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UniqueEmailValidator} from '../unique-email.validator';
import * as UiAction from '../../store/ui/ui.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy{

  isLoading$: Observable<boolean> ;
  signUpForm: FormGroup;
  error$: Observable<string> ;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.AppState>,
    private uniqueEmailValidator: UniqueEmailValidator) { }

  ngOnInit() {
    this.initForm();
    this.isLoading$ = this.store.select(fromRoot.getAuthLoading);
    this.error$ = this.store.select(fromRoot.getAuthError);
  }
  onSubmit() {
    this.store.dispatch(new UiAction.UiMessageClearAction());
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    if (this.signUpForm.invalid) {
      return;
    }
    this.store.dispatch(new AuthActions.SignupStartAction({
      email: email,
      password: password
    }));
  }
  initForm() {
    const email = '';
    const password = '';
    this.signUpForm = new FormGroup({
        email: new FormControl(email,  {validators: [Validators.required, Validators.email],
        asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
        updateOn: 'blur'
      }),
      password: new FormControl(password, { validators: [Validators.required] }),
      agree: new FormControl('', {validators: [Validators.required]})
    });
  }

  get email() { return this.signUpForm.get('email'); }

  ngOnDestroy(): void {
  }
}
