import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UniqueEmailValidator} from '../../auth/unique-email.validator';
import {AdminService} from '../admin.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserConstants, User} from '../../shared/models/user.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as UiAction from '../../store/ui/ui.actions';
import * as AdminActions from '../store/admin.actions';
import * as fromAdmin from '../store/admin.reducer';
import {AppConfigService} from '../../shared/services/app-config.service';




@Component({
  selector: 'app-admin-user-edit',
  templateUrl: './admin-user-edit.component.html',
  styleUrls: ['./admin-user-edit.component.scss']
})
export class AdminUserEditComponent implements OnInit, OnDestroy {
  id: string;
  editMode = false;
  userEditForm: FormGroup;
  // genders = Genders.GENDERS;
  roles = UserConstants.ROLES;
  userStatus = UserConstants.STATUS;
  userTypes = UserConstants.USER_TYPES;
  imageURL = '';
  user$: Observable<User>;
  timeStamp;
  isLoading$: Observable<boolean>;
  defaultUrl;
  constructor(private route: ActivatedRoute,
              private uniqueEmailValidator: UniqueEmailValidator,
              private adminService: AdminService,
              private router: Router,
              private store: Store<fromAdmin.State>,
              private config: AppConfigService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.id = params.get('id');
        this.editMode = params.get('id') != null;
        this.initForm();
      }
    );
    this.isLoading$ = this.store.select(fromAdmin.getAdminIsLoadingState);
    this.defaultUrl = this.config.getConfig('defaultUrl');
  }

  private initForm () {
     console.log('Inside initForm');
    const alias = '';
    const email = '';
    const password = '';
    const firstName = '';
    const lastName = '';
    const roles = [];
    const status = '0';
    const userType = '';

    this.userEditForm = new FormGroup({
      'alias' :  new FormControl(alias, [Validators.required, Validators.minLength(5)]),
        'email': new FormControl(email,  {validators: [Validators.required, Validators.email],
          asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
          updateOn: 'blur'
        }),
      'password': new FormControl(password, [Validators.required, Validators.minLength(6)]),
      'firstName': new FormControl(firstName),
      'lastName': new FormControl(lastName),
      'roles': new FormControl(roles, [Validators.required]),
      'status': new FormControl(status, [Validators.required]),
      'userType': new FormControl(userType, [Validators.required]),

    });
    if (this.editMode) {
      // console.log('Inside initForm edit mode true');
      this.user$  = this.store.select(fromAdmin.getCurrentUserInAdmin).pipe(
        tap(user => {
            // Remove uniqueEmailValidator during edit mode
            this.userEditForm.get('email').clearAsyncValidators();
            this.userEditForm.get('email').updateValueAndValidity();
            this.userEditForm.patchValue({
              'alias': user.alias,
              'email': user.email,
              'password': user.password,
              'firstName': user.firstName,
              'lastName': user.lastName,
              // 'gender': user.gender,
              'roles': user.roles,
              'status': user.status+'',
              'userType': user.userType,

            });
            // console.log('after form patch' + user);
            // console.log('after form patch' + user.imageURL);
          if(user.avatar){
            this.imageURL = this.defaultUrl + `/api/user/`+user._id+`/avatar`;
          }

          }
        )
      );
    }

  }

  onSubmit() {
    this.store.dispatch(new UiAction.UiMessageClearAction());

    if (this.editMode) {
      this.store.dispatch(new AdminActions.AdminEditUserAction({id: this.id, formData: this.userEditForm.value }));
    } else {
      this.store.dispatch(new AdminActions.AdminStartAddUserAction(this.userEditForm.value));
    }
  }

  onCancel() {
   // this.router.navigate(['/admin'], { queryParams: { selectedId: this.id}, queryParamsHandling: 'merge'});
    this.router.navigate(['/admin'],{ queryParams: { selectedId: this.id}});
  }

  get alias() { return this.userEditForm.get('alias'); }
  get email() { return this.userEditForm.get('email'); }
  get password() { return this.userEditForm.get('password'); }

  public getImageURL() {
    //timestamp for URL to search the database again for the image as URL has changed due to timestamp
    // if timestamp is not used same image will be displayed
    if(this.timeStamp) {
      return this.imageURL + '?' + this.timeStamp;
    }
    return this.imageURL;
  }

  public setImageURL(url: string) {
    console.log('URL in setImageURL', url);
    if (url && url !== '') {
      this.imageURL = url;
    }
    this.timeStamp = (new Date()).getTime();
  }

  ngOnDestroy(): void {
    if(this.editMode){
      this.store.dispatch(new AdminActions.AdminEndUserEditAction());
    } else {
      this.store.dispatch(new AdminActions.AdminEndAddUserAction());
    }


  }
}
