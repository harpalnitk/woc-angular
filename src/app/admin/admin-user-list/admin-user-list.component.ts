import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, Subscription, merge, Observable} from 'rxjs';
import {User} from '../../shared/models/user.model';
import {MatPaginator, MatSort} from '@angular/material';
import * as fromAdmin from '../store/admin.reducer';
import * as AdminActions from '../store/admin.actions';
import {Store} from '@ngrx/store';
import {getIsAuthUserAdmin} from '../../app.reducer';
import {AdminService} from '../admin.service';
import {debounceTime, distinctUntilChanged, filter, startWith, switchMap} from 'rxjs/operators';
import {ActivatedRoute, NavigationCancel, Router} from '@angular/router';
import {UiService} from '../../shared/services/ui.service';
import {AppConfigService} from '../../shared/services/app-config.service';
import {Actions, ofType} from '@ngrx/effects';
import {UsersListDisplayConstants} from '../store/admin.actions';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit, OnDestroy, AfterViewInit {

  userListSubscription: Subscription;
  selectedId: string;
  data$: Observable<User []>;
  displayedColumns: string[] = ['index', 'imageURL', '_id', 'alias', 'contact.email', 'firstName',
    'lastName', 'gender', 'roles', 'userType', 'actions'];
  displayConstants: UsersListDisplayConstants;
  displayConstantsSubscription: Subscription;
  sortActive = '_id';
  sortActiveDirection = 'desc';

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  resultsLength$: Observable<number>;
  isLoading$: Observable<boolean>;

  private searchText$ = new Subject<string>();
  searchString = '';

  isUserAdmin = false;
  isUserAdminSubscription: Subscription;

  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;

  navCancel: Observable<NavigationCancel>;

  defaultUrl;

  constructor(private store: Store<fromAdmin.State>,
              private actions$: Actions,
              private adminService: AdminService,
              private router: Router,
              private route: ActivatedRoute,
              private uiService: UiService,
              private config: AppConfigService) {
    // Create a new Observable the publishes only the NavigationEnd event
    this.navCancel = router.events.pipe(
      filter(evt => evt instanceof NavigationCancel)
    ) as Observable<NavigationCancel>;
  }

  ngOnInit() {
    // Get selected user id from edit user page
    this.route.queryParamMap.subscribe(
      params => {
        if (params.has('selectedId')) {
          this.selectedId = params.get('selectedId');
          console.log('Selected ID: ' + params.get('selectedId'));
        }
      }
    );
    this.isUserAdminSubscription = this.store.select(getIsAuthUserAdmin).subscribe(
      (value) => this.isUserAdmin = value
    );
    // Message to be displayed when auth guard denies permission to non admin users.
    this.navCancel.subscribe((evt) => {
      console.log('Navigation Cancel event' + evt);
      this.uiService.showSnackBar({message: 'Permission Denied. Not sufficient privileges.'});
    });

    this.defaultUrl = this.config.getConfig('defaultUrl');
    this.isLoading$ = this.store.select(fromAdmin.getAdminIsLoadingState);
    this.data$ = this.store.select(fromAdmin.getAdminUserList);
    this.resultsLength$ = this.store.select(fromAdmin.getAdminUserListCount);
    this.displayConstantsSubscription = this.store.select(fromAdmin.getAdminDisplayConstants).subscribe(
      (data: UsersListDisplayConstants) => {
        console.log('Display Constants:',data);
        this.displayConstants = data;
        this.sortActiveDirection  = (this.displayConstants.order === 'asc') ? 'asc' : 'desc';
        this.sortActive = this.displayConstants.sort;
      }
    );
  }

  ngAfterViewInit() {
    //Applying displayConstant values from the store
    this.tick_then(() => {
      this.paginator.pageIndex = +this.displayConstants.page;
      this.paginator.pageSize = this.pageSize = +this.displayConstants.limit;
      this.sort.direction = (this.displayConstants.order === 'asc') ? 'asc' : 'desc';
      this.sort.active = this.displayConstants.sort;
    });
    this.paginator._changePageSize(this.paginator.pageSize);
    this.sort.sortChange.next({active: this.sort.active, direction: this.sort.direction});

    console.log(' in ng after view init after applying display constant values');
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // if changes occur in pagination, sort or search new user list is loaded
    this.userListSubscription = merge( this.sort.sortChange, this.paginator.page, this.searchText$)
      .pipe(
        startWith({}),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(() => {
          //this.isLoadingResults = true;
          console.log('Dispatching AdminLoadUserListAction action');
          this.store.dispatch(new AdminActions.AdminLoadUserListAction({
            sort: this.sort.active,
            order:this.sort.direction,
            page: this.paginator.pageIndex,
            limit:this.paginator.pageSize,
            search: this.searchString
          }));
          return this.actions$.pipe(
            ofType(AdminActions.AdminActionTypes.ADMIN_USER_LIST_LOADED_ACTION),
            // take(1)
          );
        })).subscribe();
  }

  search(userName: string) {
    this.searchString = userName;
    this.paginator.pageIndex = 0;
    this.searchText$.next(userName);
  }

  onDeleteUser(id: string) {
    if (this.isUserAdmin) {
      this.store.dispatch(new AdminActions.AdminDeleteUserAction(id));
    } else {
      this.uiService.showSnackBar({message: 'Permission Denied. Not sufficient privileges.'});
    }
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  getImageURL(id: string) {

    return this.defaultUrl + "/api/user/"+id+"/avatar";
  }

  tick_then(fn: () => any) { setTimeout(fn, 0); }

  ngOnDestroy() {
    if(this.isUserAdminSubscription) {
      this.isUserAdminSubscription.unsubscribe();
    }
    if(this.displayConstantsSubscription) {
      this.displayConstantsSubscription.unsubscribe();
    }
    if(this.userListSubscription) {
      this.userListSubscription.unsubscribe();
    }
  }
}
