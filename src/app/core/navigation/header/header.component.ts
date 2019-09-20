import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';
import {UserSummaryVM} from '../../../shared/models/view-models/user-summary-vm.model';
import {AppConfigService} from '../../../shared/services/app-config.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth: boolean = false;
  userSubscription: Subscription;
  user: UserSummaryVM;
  defaultUrl;
  // timestamp;
  constructor(private store: Store<fromRoot.AppState>,
              private config: AppConfigService) { }

  ngOnInit() {

    this.userSubscription = this.store.select(fromRoot.getAuthUser).subscribe(user => {
      this.user = user;
      this.isAuth = !!user;
    });
    //   .pipe(
    //
    //   tap(() => {
    //     console.log('changing timestamp');
    //     this.timestamp = (new Date()).getTime()
    //   })
    // )

    this.defaultUrl = this.config.getConfig('defaultUrl');
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onSignOut() {
    this.store.dispatch(new AuthActions.LogoutAction);
  }

  onSignOutAll() {
    this.store.dispatch(new AuthActions.LogoutAllAction);
  }
  getImageUrl(id: string) {
    return this.defaultUrl + "/api/user/"+id+"/avatar?"
      //+ this.timestamp
    ;
  }

  ngOnDestroy(): void {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
