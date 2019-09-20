import {Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';
import {UserSummaryVM} from '../../../shared/models/view-models/user-summary-vm.model';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean = false;
  userSubscription: Subscription;
  user: UserSummaryVM;
  constructor(private store: Store<fromRoot.AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select(fromRoot.getAuthUser).subscribe(user => {
      this.user = user;
      this.isAuth = !!user;
    });
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onSignOut() {
    this.store.dispatch(new AuthActions.LogoutAction);
  }

  onSignOutAll() {
    this.store.dispatch(new AuthActions.LogoutAllAction);
  }
  ngOnDestroy(): void {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
