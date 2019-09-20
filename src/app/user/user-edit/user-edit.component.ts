import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserConstants, User} from '../../shared/models/user.model';
import * as UserAction from '../store/user.actions';
import {Store} from '@ngrx/store';
import * as fromUser from '../store/user.reducer';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import * as UiAction from '../../store/ui/ui.actions';
import {AppConfigService} from '../../shared/services/app-config.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;
  isLoading$: Observable<boolean>;
  userEditForm: FormGroup;
  genders = UserConstants.GENDERS;
  imageURL;
  timeStamp;
  defaultUrl;
  constructor(private store: Store<fromUser.State>,
              private router: Router,
              private route: ActivatedRoute,
              private config: AppConfigService) { }

  ngOnInit() {
    console.log('User edit on init');
    this.defaultUrl = this.config.getConfig('defaultUrl');
    this.isLoading$ = this.store.select(fromUser.getUserIsLoading);
    this.userSubscription = this.store.select(fromUser.getUserProfile).pipe(
      map(user =>  _.cloneDeep(user))
    ).subscribe(user => this.user = user);
    this.initForm();
    this.patchUserForm();

  }

  private initForm () {
    this.userEditForm = new FormGroup({
      'alias' :  new FormControl(null, [Validators.required, Validators.minLength(5)]),
      contact: new FormGroup({
        'phones': new FormArray([])
      }),
      'password': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
      'gender': new FormControl('F'),
      'dob': new FormControl(null),
      'address': new FormGroup({
        'lines': new FormArray([new FormControl(null), new FormControl(null), new FormControl(null)]),
        'city': new FormControl(null),
        'state': new FormControl(null),
        'zip': new FormControl('')
      })
    });
  }

  onSubmit() {
    console.log('Form Value' + JSON.stringify(this.userEditForm.value));
    this.store.dispatch(new UiAction.UiMessageClearAction());
    this.store.dispatch(new UserAction.EditUserProfileAction(this.userEditForm.value));
  }

  cancelProfile() {
    this.router.navigate(['../'],{ relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new UserAction.EndUserProfileEditAction());
    if(this.userSubscription ) {
      this.userSubscription.unsubscribe();
    }
  }
  get phones() {
    return this.userEditForm.get('contact.phones') as FormArray;
  }
  get lines() {
    return this.userEditForm.get('address.lines') as FormArray;
  }
  onAddPhone() {
    this.phones.push(
      new FormControl(null, [Validators.required,
        Validators.pattern(/^[0-9]+[0-9]*$/)
      ])
    );
  }

  onDeletePhone(index: number) {
    this.phones.removeAt(index);
  }

  private patchUserForm() {
    this.imageURL = this.defaultUrl + "/api/user/"+this.user._id+"/avatar";
    if (this.user['contact'] && this.user.contact['phones']) {
      for (let i = 0 ; i < (this.user.contact.phones).length; i++) {
        this.phones.setControl(i , new FormControl((this.user.contact.phones)[i], [Validators.required,
          Validators.pattern(/^[0-9]+[0-9]*$/)
        ]));
      }
    }
    if (this.user['address'] && this.user.address['lines']) {
      for (let i = 0 ; i < (this.user.address.lines).length; i++) {
        this.lines.setControl(i , new FormControl((this.user.address.lines)[i]));
      }
    }
    this.userEditForm.patchValue({
      'alias': this.user.alias,
       'password': this.user.password,
       'firstName': this.user.firstName,
       'lastName': this.user.lastName,
       'gender':  this.user['gender'] ? this.user['gender'] : 'M',
      'address': {
        'city':  this.user['address'] ? this.user.address['city'] : null,
        'state':  this.user['address'] ? this.user.address['state'] : null,
        'zip':  this.user['address'] ? this.user.address['zip'] : null
      },
        'dob':   this.user['dob'] ? getDateForInput(this.user['dob']) : null
    }
    );

    function getDateForInput(date: string) : String{
      const dateObject = new Date(date);
      return dateObject.toISOString().slice(0, 10);
    }
  }

  public getImageURL() {
    if(this.timeStamp) {
      return this.imageURL + '?' + this.timeStamp;
    }
    return this.imageURL;
  }

  public setImageURL(url: string) {
    if (url && url !== '') {
      this.imageURL = url;
    }
    this.timeStamp = (new Date()).getTime();
  }

}
