import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as AuthActions from '../store/auth.actions';
import * as UiAction from '../../store/ui/ui.actions';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SignInComponent implements OnInit {

  isLoading$: Observable<boolean> ;
  signInForm: FormGroup;
  error$: Observable<string> ;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.AppState>) { }

  ngOnInit() {
    this.initForm();
    this.isLoading$ = this.store.select(fromRoot.getAuthLoading);
    this.error$ = this.store.select(fromRoot.getAuthError);
  }
  onSubmit() {
    this.store.dispatch(new UiAction.UiMessageClearAction());
    const email = this.signInForm.value.email;
    const password = this.signInForm.value.password;
    if (this.signInForm.invalid) {
      return;
    }
    this.store.dispatch(new AuthActions.LoginStartAction({
      email: email,
      password: password
    }));
  }
  initForm() {
    this.signInForm = new FormGroup({
      email: new FormControl('',  {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }
}
